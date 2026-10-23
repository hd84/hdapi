var router_lib = require('../lib_route');
const ERR = require('../../data/errors');
const common_users = require('../../../table/common_users');
const user_info = require('../../../table/user_info');
const user_character = require('../../../table/user_character');

const userMgr = require('../../manager/usermanager');


class characters extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      var type1 = param['type'];
      var uid = param['uid'];

      global.logger.info("type1=%s, uid=%s", type1, uid);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {        
        var resp = res.resp;  // response 되는 패킷의 내용을 정의        
        if( resp == undefined ){
          resp = {};
        }
        resp["game_user"] = [];
        let ret_gameuser = await userMgr.getUserInfo(uid);
        if( ret_gameuser != undefined  ){
          resp.RESULT = 0;          
          resp["game_user"].push(ret_gameuser.toObject());

          let ret_usercharacter = await user_character.getCharacters(uid);
          resp["user_character"] = [];
          if( ret_usercharacter != undefined ){
            ret_usercharacter.forEach(character => {
              resp["user_character"].push(character.toObject());
            });
          }
        } else {
          resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;
        }
        res.send(JSON.stringify(resp));
      } else {
        res.send('ERROR check type and subtype');
      }
              
    }

    this.setInit(this.getRoute, this.postRoute, 1, true);

    this.REQUEST_DATA = {
      session: { type: "string", desc: "user session" },
      uid: { type: "number", desc: "user id" }
    }
  }
};

module.exports = characters;