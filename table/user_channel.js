const DB_TABLE = require('./db_table');
const datetime = require('../app/utils/datetime');
const uuidv1 = require('uuid/v1');

const TABLE_INFO = {
  DB : "COMMON",
  tablename: 'user_channel',
  primary_key: 'uid',  
}

class TB_USER_CHANNEL extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.idx = null;    
    this.ch = null;    
    this.cid = null;
    this.uniqueid = null;
    this.created_at = null;
    this.updated_at = null;
    if (row) this.setData(row);
  }
};

exports.query = async function( query ){

}

exports.getUserByUniqueId = async function (uniqueid) {
  try {
    const table = new TB_USER_CHANNEL();
    global.logger.debug(`[GetUserByUniqueId] SQL:`, table.query().select('*').where({ uniqueid }).toString());    
    const rows = await table.query().select('*').where({ uniqueid: uniqueid });
    if( rows.length == 0) return null;    
    return new TB_USER_CHANNEL(rows[0]);    
  } catch (err) {
    global.logger.error(err);
  }

}

exports.getUserByChannel = async function (ch, cid) {
  try {
    const table = new TB_USER_CHANNEL();
    global.logger.debug(`[GetUserByChannel] SQL:`, table.query().select('*').where({ ch, cid }).toString());    
    const rows = await table.query().select('*').where({ ch: ch, cid: cid });
    if( rows.length == 0) return null;    
    return new TB_USER_CHANNEL(rows[0]);
  } catch (err) {
    global.logger.error(err);
  }
}

exports.newUserChannel = async function(ch, cid, deviceid) {
  const table = new TB_USER_CHANNEL();
  try {    
    let data;
    data = {};
    data.ch = ch;
    data.cid = cid;
    data.uniqueid = uuidv1();    
    data.created_at = datetime.now();
    data.updated_at = datetime.now();
    const query = table.query().insert(data);
    global.logger.debug(`[NewUser] SQL:`, query.toString());
    const result = await query;
    if( result && result[0] ){
      data.idx = result[0];
    }

    let ret = new TB_USER_CHANNEL(data);
    return ret;
    
  } catch (err) {
    global.logger.error(err);
  }
}

exports.updateUserOne = async function (data) {
  const table = new TB_USER_CHANNEL();
  try {
    data.updated_at = datetime.now();
    const query = table.query().where({ idx: data.idx }).update(data);
    global.logger.debug(`[UpdateUserOne] SQL:`, query.toString());
    const result = await query;
    return result;
  } catch (err) {
    global.logger.error(err);
  }
}

exports.TB_USER_CHANNEL = TB_USER_CHANNEL;
