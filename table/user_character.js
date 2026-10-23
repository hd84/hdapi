const DB_TABLE = require('./db_table');
const datetime = require('../app/utils/datetime');

const TABLE_INFO = {
  DB : "GAME",
  tablename: 'user_character',
  primary_key: 'idx',  
  shard_key: 'uid'
}

class TB_USER_CHARACTER extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.idx = null;    
    this.uid = null;    
    this.did = null;
    this.lv = null;
    this.exp = null;    
    this.created_at = null;
    this.updated_at = null;
    if (row) this.setData(row);
  }
};

exports.query = async function( query ){

}

exports.getCharacters = async function (uid) {
  try {
    const table = new TB_USER_CHARACTER();
    table.shardKey = uid;
    global.logger.debug(`[GetCharacters] SQL:`, table.query().select('*').where({ uid }).toString());    
    const rows = await table.query().select('*').where({ uid: uid });
    return rows.map(row => new TB_USER_CHARACTER(row));
  } catch (err) {
    global.logger.error(err);
  }

}

exports.getUserByDid = async function (uid, did) {
  try {
    const table = new TB_USER_CHARACTER();
    table.shardKey = uid;
    global.logger.debug(`[GetUserByDid] SQL:`, table.query().select('*').where({ uid, did }).toString());    
    const rows = await table.query().select('*').where({ uid: uid, did: did });
    if( rows.length == 0) return null;    
    return new TB_USER_CHARACTER(rows[0]);
  } catch (err) {
    global.logger.error(err);
  }
}

exports.tempUserCharacter = async function(uid, did) {
  const table = new TB_USER_CHARACTER();
  try {    
    let data;
    data = {};
    data.uid = uid;
    data.did = did;
    data.lv = 1;
    data.exp = 0;    
    data.created_at = datetime.now();
    data.updated_at = datetime.now();    
    let ret = new TB_USER_CHARACTER(data);
    return ret;
    
  } catch (err) {
    global.logger.error(err);
  }
}

exports.newUserCharacter = async function(uid, did) {
  const table = new TB_USER_CHARACTER();
  try {    
    let data;
    data = {};
    data.uid = uid;
    data.did = did;
    data.lv = 1;
    data.exp = 0;
    data.count = 1;
    data.created_at = datetime.now();
    data.updated_at = datetime.now();
    const query = table.query().insert(data);
    global.logger.debug(`[NewUserCharacter] SQL:`, query.toString());
    const result = await query;
    if( result && result[0] ){
      data.idx = result[0];
    }

    let ret = new TB_USER_CHARACTER(data);
    return ret;
    
  } catch (err) {
    global.logger.error(err);
  }
}



exports.insertList = function(list) {
  return TB_USER_CHARACTER.insertList(list);
}

exports.TB_USER_CHARACTER = TB_USER_CHARACTER;
