const datetime = require('../app/utils/datetime');

const ignore_keys = ['TABLE_INFO', 'shardKey', '_shardKey', 'shard', '_shard'];
class DB_TABLE {
  constructor(tableInfo) {
    if (!tableInfo || !tableInfo.DB || !tableInfo.tablename) {
      throw new Error('tableInfo.DB and tableInfo.tablename are required');
    }

    this.TABLE_INFO = tableInfo;
    this._shardKey = 0;
    this._shard = 0;
  }

  get tableName() {
    return this.TABLE_INFO.tablename;
  }

  get shard() {
    return this._shard;
  }

  set shard(value) {
    this._shard = value;
  }

  get shardKey() {
    return this._shardKey;
  }

  set shardKey(value) {
    this._shardKey = value;

    this.hashShardKey(value);
  }

  hashShardKey(value) {
    if (typeof value === 'string' && value.trim() !== '' && !isNaN(parseInt(value, 10))) {
      value = parseInt(value, 10);
    }

    if( typeof value === 'number') {
      this.shard = value % global.DB[this.TABLE_INFO.DB].length; 
    } else if( typeof value === 'string') {
      let hash = 0;
      for (let i = 0; i < value.length; i++) {
        hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
      }
      this.shard = hash % global.DB[this.TABLE_INFO.DB].length; 
    } else {
      this.shard = 0;
      global.logger.error('Unsupported shard key type: ' + typeof value + ` value : ${value}`);
      
    }

    return this.shard;
  }

  get knexdb() {
    if (!global.DB[this.TABLE_INFO.DB]) {
      throw new Error('global.DB[' + this.TABLE_INFO.DB + '] is not initialized');
    }

    return global.DB[this.TABLE_INFO.DB][this.shard];
  }

  query() {
    return this.knexdb(this.tableName);
  }

  // update query 실행
  async updateData() {    
    const primaryKey = this.TABLE_INFO.primary_key;
    if (!primaryKey) {
      throw new Error('TABLE_INFO.primary_key is required for updateData');
    }

    const update_fields = {};
    for (const key of Object.keys(this)) {
      if (ignore_keys.includes(key)) continue;
      if (key.startsWith('old_')) continue;
      if (key === primaryKey) continue;
      if (typeof this[key] === 'function') continue;

        
      // old_ 값과 다른(변경된) 열만 update 대상에 포함
      if (this[key] !== undefined && this[`old_${key}`] !== this[key]) {
        update_fields[key] = this[key];
      }
    }

    if (Object.keys(update_fields).length === 0) return null;

    this["updated_at"] = new Date();
    update_fields["updated_at"] = this["updated_at"];

    const query = this.query().where(primaryKey, this[primaryKey]).update(update_fields);
    global.logger.debug(`[UpdateData] SQL(${this.shard}):`, query.toString());

    return await query;
  }

  async findAll() {
    return this.query().select('*');
  }

  // insert query 실행 (toObject 로 직렬화 후 삽입, 생성된 PK는 인스턴스에 반영)
  async insertData() {
    const primaryKey = this.TABLE_INFO.primary_key;
    const query = this.query().insert(this.toObject());
    global.logger.debug(`[InsertData] SQL:`, query.toString());

    const result = await query;
    if (primaryKey && result && result[0] !== undefined) {
      this[primaryKey] = result[0];
      this[`old_${primaryKey}`] = result[0];
    }

    return result;
  }

  toObject(format = 'YYYY-MM-DD HH:MM:SS') {
    const data = {};

    for (const key of Object.keys(this)) {
      if (ignore_keys.includes(key)) continue;
      if( key.startsWith('old_')) continue;

      const value = this[key];
      const isDateTime = value instanceof Date ||
        (typeof value === 'string' &&
          /^(\d{4}-\d{2}-\d{2})(?:T|\s)\d{2}:\d{2}:\d{2}/.test(value));

      data[key] = isDateTime ? datetime.formatDateTime(value, format) : value;
    }

    return data;
  }

  setData(row) {
    if (!row) return;

    for (const key of Object.keys(this)) {
      if (ignore_keys.includes(key)) continue;
      if (row[key] !== undefined) {
        this[key] = row[key];
        this[`old_${key}`] = row[key];                
      }
    }

    if( this.TABLE_INFO.shard_key !== undefined && row[this.TABLE_INFO.shard_key] !== undefined ){
      this.shardKey = row[this.TABLE_INFO.shard_key];
    }
  }

  // DB_TABLE(하위 클래스 포함) 인스턴스 배열을 shard 별로 묶어 한 번에 insert
  static async insertList(list) {
    try {
      if (!Array.isArray(list) || list.length === 0) return [];

      const shardGroups = new Map();
      for (const table of list) {
        if (!shardGroups.has(table.shard)) shardGroups.set(table.shard, []);
        shardGroups.get(table.shard).push(table);
      }

      for (const tables of shardGroups.values()) {
        const insertData = tables.map(table => table.toObject());
        const query = tables[0].query().insert(insertData);
        global.logger.debug(`[InsertList] SQL(${tables[0].shard}):`, query.toString());
        await query;
      }

      return list;
    } catch (err) {
      global.logger.error(err);
    }
  }
}

module.exports = DB_TABLE;