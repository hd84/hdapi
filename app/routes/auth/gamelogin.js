var router_lib = require('../lib_route');

const common_users = require('../../../table/common_users');
const user_channel = require('../../../table/user_channel');

const user_info = require('../../../table/user_info');

const userMgr = require('../../../app/manager/usermanager');
const respMgr = require('../../manager/responsemanager');

const DEF = require('../../data/defines');
const ERR = require('../../data/errors');

class gamelogin extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      var type1 = param['type'];
      var uniqueid = param['uniqueid'];

      global.logger.info("type1=%s, uniqueid=%s", type1, uniqueid);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {                
        if( res.resp == undefined ){
          res.resp = {};
        }

        let channelInfo = await user_channel.getUserByUniqueId(uniqueid);
        if( channelInfo != null && channelInfo.cid != null ){
          let userObj = await common_users.getUserByUniqueId(uniqueid);
          if( userObj != null && userObj.uid != null ){
            let session = await userMgr.setUserLoginSession(userObj.uid);
            if( session != undefined ) {
              res.resp["session"] = JSON.parse(session);

              res.resp.RESULT = 0;
              res.resp["userinfo"] = [];
              res.resp["userinfo"].push(userObj.toObject());                    

              res.resp["game_user"] = [];
              let ret_gameuser = await user_info.getUserByUid(userObj.uid);
              if( ret_gameuser != undefined  ){
                await ret_gameuser.refreshHeart();
                await ret_gameuser.updateData();            
                res.resp["game_user"].push(ret_gameuser.toObject());                                
              }
            } else {
              res.resp.RESULT = ERR.ERROR_CODE.FAILED_CREATE_SESSION;
            }          
          } else {
            let ret = await common_users.tempUser(uniqueid);
            if( ret != null ){
              let newuser = await common_users.newUser(ret);
              let session = await userMgr.setUserLoginSession(newuser.uid);
              if( session != undefined ) {
                res.resp["session"] = JSON.parse(session);
                res.resp.RESULT = 0;              
                let ret_gameuser = await user_info.newData(newuser.uid);
                res.resp["userinfo"] = [];
                res.resp["userinfo"].push(newuser.toObject());
                res.resp["game_user"] = [];
                res.resp["game_user"].push(ret_gameuser.toObject());

                userMgr.createUserProcess(newuser.uid);
                global.logger.info("session=%s", session);
              } else {
                res.resp.RESULT = ERR.ERROR_CODE.FAILED_CREATE_SESSION;
              }
              
            } else {
              res.resp.RESULT = -1;
            }
          } 
        } else {
          res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;
        }            
        
        res.send(JSON.stringify(res.resp));
      } else {
        res.send('ERROR check type and subtype');
      }
    }

    this.setInit(this.getRoute, this.postRoute, 1, false);

    this.REQUEST_DATA = {
      uniqueid: { type: "string", desc: "deviceid" }
    }

    this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
      session: respMgr.session,
      userinfo: respMgr.userinfo,
      game_user: respMgr.game_user
    }
  }
};

module.exports = gamelogin;