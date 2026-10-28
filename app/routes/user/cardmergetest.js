const router_lib = require('../lib_route');
const ERR = require('../../data/errors');
const DEF = require('../../data/defines');
const common_users = require('../../../table/common_users');
const user_info = require('../../../table/user_info');
const user_card = require('../../../table/user_card');

const userMgr = require('../../manager/usermanager');
const respMgr = require('../../manager/responsemanager');

const rewardMgr = require('../../manager/rewardmanager');

class cardmerge extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      var type1 = param['type'];
      var uid = param['uid'];
      let rarity = param['rarity'];
      let count = param['count'];
      

      global.logger.info("type1=%s, uid=%s, rarity=%s, count=%s", type1, uid, rarity, count);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {                        
        if( res.cached.userdata != undefined  ){
          res.resp.RESULT = 0;                    
          let ret_usercard = await user_card.getCards(uid);
          if( ret_usercard != undefined ){
            if( count == 0 ){

            } else {              
              let merge_result = rewardMgr.card_merge(res, rarity, count);
              res.resp["merge_result"] = merge_result;
              
            }
          }
                    
          
          
          
        } else {
          res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;
        }
        res.complete();
      } else {
        res.send('ERROR check type and subtype');
      }
              
    }

    this.setInit(this.getRoute, this.postRoute, 1, true);

    this.REQUEST_DATA = {
      session: { type: "string", desc: "user session" },
      uid: { type: "number", desc: "user id" },
      rarity : { type:"number", desc : "rarity" },
      count : { type:"number", desc : "count" }
    }

    this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
      game_user: respMgr.game_user,      
    }
  }
};

module.exports = cardmerge;