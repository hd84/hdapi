const DB_TABLE = require('./db_table');
const datetime = require('../app/utils/datetime');
const uuidv1 = require('uuid/v1');

const TABLE_INFO = {
  DB : "COMMON",
  tablename: 'users',
  primary_key: 'uid',  
  shard_key: 'uid'
}

class TB_COMMON_USERS extends DB_TABLE {
  constructor(row) {
    super(TABLE_INFO);
    this.uid = null;    
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
    const table = new TB_COMMON_USERS();
    global.logger.debug(`[GetUserByUniqueId] SQL:`, table.query().select('*').where({ uniqueid }).toString());    
    const rows = await table.query().select('*').where({ uniqueid: uniqueid });
    if( rows.length === 0 )  {
      global.logger.debug(`[GetUserByUniqueId] No user found for uniqueid: ${uniqueid}`);
      return null;
    }      
    else {
      global.logger.debug(`[GetUserByUniqueId] User found for uniqueid: ${uniqueid}`);
      global.logger.debug(`[GetUserByUniqueId] User data:`, rows[0]);
      return new TB_COMMON_USERS(rows[0]);
    }
    
  } catch (err) {
    global.logger.error(err);
  }

}

exports.getUserByUid = async function (uid) {
  try {
    const table = new TB_COMMON_USERS();
    global.logger.debug(`[GetUserByUid] SQL:`, table.query().select('*').where({ uid }).toString());    
    const rows = await table.query().select('*').where({ uid: uid });
    return rows.map(row => new TB_COMMON_USERS(row));
  } catch (err) {
    global.logger.error(err);
  }
}

exports.tempUser = async function(uniqueid) {
  const table = new TB_COMMON_USERS();
  try {
    let data = {};    
    data.uniqueid = uniqueid || "";
    data.created_at = datetime.now();
    data.updated_at = datetime.now();    
    return data;
  } catch (err) {
    global.logger.error(err);
  }
}
exports.newUser = async function(tempUser) {  
  try {    
    let data;
    if( tempUser )
      data = tempUser;
    else{
      data = {};          
      data.created_at = datetime.now();
      data.updated_at = datetime.now();
    }    
    const table = new TB_COMMON_USERS(data);
    await table.insertData();
    global.logger.debug(`[NewUser] Inserted user:`, table.toObject());
    return table;
  } catch (err) {
    global.logger.error(err);
  }
}

exports.updateUserOne = async function (data) {
  const table = new TB_COMMON_USERS();
  try {
    data.updated_at = datetime.now();
    const query = table.query().where({ uid: data.uid }).update(data);
    global.logger.debug(`[UpdateUserOne] SQL:`, query.toString());
    const result = await query;
    return result;
  } catch (err) {
    global.logger.error(err);
  }
}

exports.TB_COMMON_USERS = TB_COMMON_USERS;
