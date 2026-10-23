const common_users = require('../../table/common_users');
const user_info = require('../../table/user_info');
const user_character = require('../../table/user_character');
const user_card = require('../../table/user_card');

const uuidv1 = require('uuid/v1');

const DEF = require('../data/defines');
const ERR = require('../data/errors');

const commonfunc = require('../routes/common/commonfunc');

exports.createUserProcess = async function(uid) {
  let characters = [];
  for( let i = 1001; i < 1005; i++ ) {
    let character = await user_character.tempUserCharacter(uid, i);
    characters.push(character);    
  }

  let cards = [];
  for( let i = 4001; i < 4005; i++ ) {
    let card = await user_card.tempUserCard(uid, i);
    cards.push(card);    
  }

  await user_card.insertList(cards);
  await user_character.insertList(characters);

}

exports.getUserInfo = async function (uid) {
  let ret = await user_info.getUserByUid(uid);
  if( ret != undefined  ){    
    
  }
  return ret;
}
exports.setUserLoginSession = async function (uid) {
  var rediskey = this.getUserRedisKey(uid); 
  var objData = { version: global.config.version, uuid: uuidv1() };
  var redisValue = JSON.stringify(objData);
    
  let redisClient = commonfunc.getRedisGame(uid);
  
  let ret = await redisClient.setValue(rediskey, redisValue, global.config.session_expire);
  return new Promise((resolve, reject) => {
    if(ret.err == 0) {
      resolve(redisValue);
    }
    else {
      resolve(undefined);
    }
  });
  
  
}

exports.getUserLoginSessionRedis = async function (uid) {
  var rediskey = this.getUserRedisKey(uid);
  let redisClient = commonfunc.getRedisGame(uid);
  let ret = await redisClient.getValue(rediskey);
  if (ret.err == 0) {
    return ret.data;
  }
  else {
    return null;
  }
}

exports.getUserRedisKey = function (uid) {
  var ret = "session-" + uid
  return ret;
}



exports.UserSessionCheck = async function (uid, loginsession) {
  return new Promise(async(resolve, reject) => {
    if (global.config.session_use == DEF.SESSION_USE.NONE) {
      resolve(0);
    }
    else if (global.config.session_use == DEF.SESSION_USE.DEFAULT) {
      // 클라이언트에서 보내주는 세션 정보에 접속했던 서버 버전과 UUID 동봉
      // $ 기준 앞으로 uuid 뒤로 게임서버 버전        
      var arsplit = loginsession.split('$');
      var uuid = arsplit[0];
      //var clientserverversion = arsplit[1];
  
      // redis에서 유저 세션정보 획득
      let value = await this.getUserLoginSessionRedis(uid); 
      
      // 세션이 만료 되어있을때
      if (value == null) {
        resolve(10);
      }
      // 세션이 남아있을떄
      else {
        var jsondata = JSON.parse(value);

        let redisClient = commonfunc.getRedisGame(uid);
        // uuid값이 다르면 세션만료처리
        if (uuid != jsondata.uuid) {
          resolve(10);
        }
        // 서버 버전이 다르면 redis에서 해당유저 세션 삭제 후 세션만료 보냄
        // else if (clientserverversion != global.config.version) {
        //   var rediskey = await this.getUserRedisKey(uid);        
        //   redisClient.delkey(rediskey, function (retdel) {
        //     if (retdel == 1) {
        //       resolve(10);
        //     }
        //     else {
        //       resolve(10);
        //     }
        //   });

        // }
        // 서버버전이 같고 uuid도 동일하면 세션시간 갱신
        else {
          
          redisClient.setExpire(this.getUserRedisKey(uid), global.config.session_expire);
          resolve(0);
        }
      }
    
    }
    else if (global.config.session_use == DEF.SESSION_USE.AUTO_REFRESH) {
      // 클라이언트에서 보내주는 세션 정보에 접속했던 서버 버전과 UUID 동봉
      // $ 기준 앞으로 uuid 뒤로 게임서버 버전        
      var arsplit = loginsession.split('$');
      var uuid = arsplit[0];
      var clientserverversion = arsplit[1];
  
      // redis에서 유저 세션정보 획득
      let value = await this.getUserLoginSessionRedis(uid);      
      // 세션이 만료 되어있을때
      if (value == null) {  
        // 서버 버전이 다르면 클라이언트 세션만료로 보냄
        // if (clientserverversion != global.config.version) {
        //   resolve(10);
        // }
        // 서버 버전이 같으면 갱신시도 요청
        //else {
          resolve(100);
        //}

      }
      // 세션이 남아있을떄
      else {
        var jsondata = JSON.parse(value);

        // uuid값이 다르면 세션만료처리
        if (uuid != jsondata.uuid) {
          resolve(10);
        }
        // 서버 버전이 다르면 redis에서 해당유저 세션 삭제 후 세션만료 보냄
        // else if (clientserverversion != global.config.version) {
        //   var rediskey = this.getUserRedisKey(uid);
        //   let redisClient = commonfunc.getRedisGame(uid);
        //   redisClient.delkey(rediskey, function (retdel) {
        //     if (retdel == 1) {
        //       resolve(10);
        //     }
        //     else {
        //       resolve(10);
        //     }
        //   });

        // }
        // // 서버버전이 같고 uuid도 동일하면 세션시간 갱신
        // else {
          let redisClient = commonfunc.getRedisGame(uid);
          redisClient.setExpire(this.getUserRedisKey(uid), global.config.session_expire);
          resolve(0);
        // }
      }
    }
  });
}

exports.getWebUserRedisKey = function (userid) {
  var ret = "webuser:" + userid;
  return ret;
}

exports.getWebUserLoginSessionRedis = async function (userid) {
  var rediskey = this.getWebUserRedisKey(userid);
  let redisClient = commonfunc.getRedisGame(userid);
  let ret = await redisClient.getValue(rediskey);
  if (ret.err == 0) {
    return ret.reply;
  } else {
    return undefined
  }
}
exports.getWebUserLoginSessionRedis = async function (userid) {
  var rediskey = this.getWebUserRedisKey(userid);
  let redisClient = commonfunc.getRedisGame(userid);
  let ret = await redisClient.getValue(rediskey);
  if (ret.err == 0) {
    return ret.reply;
  } else {
    return undefined
  }
}

exports.setWebUserRedisKey = async function (userid) {
  let ret = this.getWebUserRedisKey(userid);  

  var objData = { userid: userid, };
  let redisClient = commonfunc.getRedisGame(userid);
  let ret_session = await redisClient.setValue(this.getWebUserRedisKey(userid), JSON.stringify(objData), global.config.session_expire );
  
  if (ret_session.err == null) {
    var jsondata = JSON.parse(JSON.stringify(objData));

    redisClient.setExpire(this.getWebUserRedisKey(userid), global.config.session_expire);
    userinfo.loginsession = jsondata.uuid + "$" + jsondata.version;
    resp["userinfo"].push(userinfo);
    res.send(JSON.stringify(resp));
  }
  
  return ret;
}

exports.webUserSessionCheck = async function (req, res) {
  
  let ret_session = await this.getWebUserLoginSessionRedis( req.session.id )
  
  return ret_session;
}