const DB_TABLE = require('./db_table');

const TABLE_INFO = {
  tablename: 'tb_web_account',
  primary_key: 'idx',
}

class TB_WEB_ACCOUNT extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.idx = null;
    this.userid = null;
    this.password = null;
    if (row) this.setData(row);
  }
};

exports.query = async function( query ){

}

exports.getWebAccountData = async function (userid) {
  try {
    const table = new TB_WEB_ACCOUNT();
    global.logger.debug(`[GetWebAccountData] SQL:`, table.query().select('*').where({ userid: userid }).toString());
    const rows = await table.query().select('*').where({ userid: userid });
    return rows.map(row => new TB_WEB_ACCOUNT(row));
  } catch (err) {
    global.logger.error(err);
  }

}

exports.TB_WEB_ACCOUNT = TB_WEB_ACCOUNT;
