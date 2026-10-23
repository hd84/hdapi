const DB_TABLE = require('./db_table');

const TABLE_INFO = {
  DB : "COMMON",
  tablename: 'tb_define',
  primary_key: 'name',
}

class TB_DEFINE extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.name = null;
    this.value = null;
    if (row) this.setData(row);
  }
};

exports.query = async function( query ){

}

exports.getDefineData = async function () {
  try {
    const table = new TB_DEFINE();
    global.logger.debug(`[GetDefineData] SQL:`, table.query().select('*').toString());    
    const rows = await table.findAll();
    return rows.map(row => new TB_DEFINE(row));
  } catch (err) {
    global.logger.error(err);
  }

}

exports.TB_DEFINE = TB_DEFINE;
