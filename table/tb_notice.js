const DB_TABLE = require('./db_table');
const datetime = require('../app/utils/datetime');

const TABLE_INFO = {
  DB: "COMMON",
  tablename: 'tb_notice',
  primary_key: 'idx',  
}

class TB_NOTICE extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.idx = null;
    this.noticetext = null;
    if (row) this.setData(row);
  }
};

exports.query = async function( query ){

}

exports.GetNoticeData = async function () {
  try {
    

    const now = datetime.now();
    
    const table = new TB_NOTICE();
    const query = table.query()
      .select('*')
      .where('startdate', '<=', now)
      .andWhere('enddate', '>', now);
    global.logger.debug(`[GetNoticeData] SQL:`, query.toString());
    const rows = await query;
    return rows.map(row => new TB_NOTICE(row));
  } catch (err) {
    global.logger.error(err);
  }

}

exports.TB_NOTICE = TB_NOTICE;
