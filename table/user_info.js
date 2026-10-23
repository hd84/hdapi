const DB_TABLE = require('./db_table');
const datetime = require('../app/utils/datetime');

const TABLE_INFO = {
  DB : "GAME",
  tablename: 'user_info',
  primary_key: 'uid',  
  shard_key: 'uid'
}

class TB_USER_INFO extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);    
    this.uid = null;    
    this.lv = 0;
    this.exp = 0;
    this.nick = "";
    this.gold = 0;
    this.gem_paid = 0;
    this.gem_free = 0;
    this.heart = 0;
    this.heart_at = null;
    this.created_at = null;
    this.updated_at = null;
    if (row) this.setData(row);
  }

  refreshHeart = async function() {
    const max_heart = global.GAME_DEFINE["MAX_HEART"];
    const diff_time = datetime.TIMESTAMP(null,  "seconds") - datetime.TIMESTAMP(this.heart_at, "seconds");
    if( diff_time > 0 ){
      let add_heart = Math.floor(diff_time / global.GAME_DEFINE["HEART_RECOVER_TIME"]);
      this.heart = Math.min(this.heart + add_heart, max_heart);

      if( this.heart < max_heart ){
        this.heart_at = datetime.addsecond(datetime.now(), -(diff_time % global.GAME_DEFINE["HEART_RECOVER_TIME"]));
      } else {
        this.heart_at = datetime.now();
      }
        
    }
  }  
};

exports.query = async function( query ){

}

exports.newData = async function(uid) {
  const table = new TB_USER_INFO();
  try {    
    table.shardKey = uid;

    let data;
    data = {};
    data.uid = uid;    
    data.lv = 0;
    data.exp = 0;
    data.nick = "";
    data.gold = 0;
    data.gem_paid = 0;
    data.gem_free = 0;
    data.heart = global.GAME_DEFINE["MAX_HEART"];
    data.heart_at = datetime.now();
    data.created_at = datetime.now();
    data.updated_at = datetime.now();
    const query = table.query().insert(data);
    global.logger.debug(`[NewUser] SQL:`, query.toString());
    const result = await query;
    if( result && result[0] ){
      data.uid = result[0];
    }

    let ret = new TB_USER_INFO(data);
    return ret;
    
  } catch (err) {
    global.logger.error(err);
  }
}

exports.getUserByUid = async function (uid) {
  try {
    const table = new TB_USER_INFO();
    table.shardKey = uid;
    global.logger.debug(`[GetUserByUid] SQL(${table.shard}):`, table.query().select('*').where({ uid }).toString());    
    const rows = await table.query().select('*').where({ uid: uid });
    if( rows.length == 0) return null;    

    let ret = new TB_USER_INFO(rows[0]);
    await ret.refreshHeart();
    await ret.updateData();
    return ret;
  } catch (err) {
    global.logger.error(err);
  }

}


exports.TB_USER_INFO = TB_USER_INFO;
