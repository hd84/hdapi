const DB_TABLE = require('./db_table');

const TABLE_INFO = {
  DB : "COMMON",
  tablename: 'key_data',
  primary_key: 'key',
}

class KEY_DATA extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.key = null;
    this.value = null;
    if (row) this.setData(row);
  }
};

exports.query = async function( query ){

} 

exports.getKeyData = async function () {
  try {
    const table = new KEY_DATA();
    global.logger.debug(`[getKeyData] SQL:`, table.query().select('*').toString());    
    const rows = await table.findAll();
    return rows.map(row => new KEY_DATA(row));
  } catch (err) {
    global.logger.error(err);
  }

}

exports.KEY_DATA = KEY_DATA;
