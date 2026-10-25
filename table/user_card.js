const DB_TABLE = require('./db_table');
const datetime = require('../app/utils/datetime');

const TABLE_INFO = {
  DB : "GAME",
  tablename: 'user_card',
  primary_key: 'idx',  
  shard_key: 'uid'
}

class TB_USER_CARD extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.idx = null;    
    this.uid = null;    
    this.did = null;
    this.lv = null;
    this.exp = null;
    this.count = null;
    this.created_at = null;
    this.updated_at = null;
    if (row) this.setData(row);
  }
};

exports.query = async function( query ){

}


exports.getCards = async function (uid) {
  try {
    const table = new TB_USER_CARD();
    table.shardKey = uid;
    global.logger.debug(`[GetCards] SQL:`, table.query().select('*').where({ uid }).toString());    
    const rows = await table.query().select('*').where({ uid: uid });
    if( rows.length == 0) return null;    
    return rows.map(row => new TB_USER_CARD(row));
  } catch (err) {
    global.logger.error(err);
  }
}

exports.tempUserCard = async function(uid, did, count = 0) {
  const table = new TB_USER_CARD();
  try {    
    let data;
    data = {};
    data.uid = uid;
    data.did = did;
    data.lv = 1;
    data.exp = 0;
    data.count = count;
    data.created_at = datetime.now();
    data.updated_at = datetime.now();    
    let ret = new TB_USER_CARD(data);
    return ret;
    
  } catch (err) {
    global.logger.error(err);
  }
}

exports.newUserCard = async function(uid, did) {
  const table = new TB_USER_CARD();
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
    global.logger.debug(`[NewUserCard] SQL:`, query.toString());
    const result = await query;
    if( result && result[0] ){
      data.idx = result[0];
    }

    let ret = new TB_USER_CARD(data);
    return ret;
    
  } catch (err) {
    global.logger.error(err);
  }
}

exports.insertList = async function(list) {
  return TB_USER_CARD.insertList(list);
}

exports.updateList = async function(list) {
  list.forEach(async (item) => {
    const table = new TB_USER_CARD();
    table.shardKey = item.uid;
    const query = table.query().update(item).where({ idx: item.idx });
    global.logger.debug(`[UpdateList] SQL:`, query.toString());
    await query;
  });
}

exports.TB_USER_CARD = TB_USER_CARD;
