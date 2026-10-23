const mysql = require('mysql2/promise');
const knex = require('knex');

let pool = null;
let knexDb = null;

// 초기화 함수
exports.init = async function(host, db, user, pwd, connectionLimit) {  

  pool = mysql.createPool({
    host: host,
    user: user,
    password: pwd,
    database: db,
    waitForConnections: true,
    connectionLimit: connectionLimit || 10,
    queueLimit: 0,
    multipleStatements: true
 });  
 exports.pool = pool;

  knexDb = knex({
    client: 'mysql2',
    connection: {
      host: host,
      user: user,
      password: pwd,
      database: db
    },
    pool: { min: 0, max: connectionLimit || 10 }
  });
  exports.knexDb = knexDb;

  return new Promise(async function (resolve, reject) {
    try {    
      // 연결 성공 콜백
      let conn = await pool.getConnection();
      global.logger.info(`MySQL Connection ${host}, ${db}, ${user} Success!`);
      global.logger.debug('SQL_Query module initialized.');
      conn.release();
      resolve();
    } catch (err) {
      global.logger.error('MySQL Connection Error: ', err);
      global.logger.error('SQL_Query module Failed.');
      reject(err);
    }
  });
 
};

exports.CreateResultValue = async function(rows) {  
  let ret = {result: -1, rows: []};
  return new Promise(function (resolve, reject) {
  try {
    for (let i = 0; i < rows.length; i++) {
      let resultSet = rows[i];
      if (resultSet.length > 0 && resultSet[0]['o_param1'] !== undefined) {
        ret.result = resultSet[0]['o_param1'];        
      }
      if( i == 1 ){
        ret.rows = resultSet;
      }
    }
    resolve(ret);
  } catch (err) {
    global.logger.error(err);
    reject(err);
  }
});
  
}


// 유저 정보 리턴
// user_id가 입력되면 해당것만 리턴
// pool.execute 는 실행하고 세션사라짐
// pool.getConnection() 으로 커넥션 얻어서 사용해야 세션 유지됨
exports.GetUserInfo = async function (accno) {  
  try {
    let ret;
    const [rows] =await pool.execute('CALL p_get_user_info(?,@RETURN_VALUE);', [accno]);
    global.logger.info(`GetUserInfo rows: ${JSON.stringify(rows)}`);
    ret = await this.CreateResultValue(rows);
    return ret;
  } catch (err) {
    global.logger.error(err);
  }

  
}

exports.GetUserCard = async function (accno) {  
  try {
    let ret;
    const [rows] = await pool.execute('CALL p_get_user_card(?,@RETURN_VALUE);', [accno]);
    global.logger.info(`GetUserCard rows: ${JSON.stringify(rows)}`);
    ret = await this.CreateResultValue(rows);
    return ret;
  } catch (err) {
    global.logger.error(err);
  }
}
