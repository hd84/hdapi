const router_lib = require('../lib_route');
const ERR = require('../../data/errors');
const common_users = require('../../../table/common_users');
const user_info = require('../../../table/user_info');
const user_card = require('../../../table/user_card');

const userMgr = require('../../manager/usermanager');
const respMgr = require('../../manager/responsemanager');


class cardmerge extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      var type1 = param['type'];
      var uid = param['uid'];
      let auto = param['auto'];
      let cards = param['cards'];

      global.logger.info("type1=%s, uid=%s, auto=%s, cards=%s", type1, uid, auto, cards);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {                
        if( res.resp == undefined ){
          res.resp = {};
        }
        if( res.cached.userdata != undefined  ){
          res.resp.RESULT = 0;                    
          let ret_usercard = await user_card.getCards(uid);
          res.resp["user_card"] = [];
          if( ret_usercard != undefined ){
            ret_usercard.forEach(card => {
              res.resp["user_card"].push(card.toObject());
            });
          }
        } else {
          res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;
        }
        res.send(JSON.stringify(res.resp));
      } else {
        res.send('ERROR check type and subtype');
      }
              
    }

    this.setInit(this.getRoute, this.postRoute, 1, true);

    this.REQUEST_DATA = {
      session: { type: "string", desc: "user session" },
      uid: { type: "number", desc: "user id" },
      auto : { type:"number", desc : "auto merge flag 0- false, 1 > rarity" },
      cards: { type: "string", desc: "user cards - auto value 0 means not auto merging" }
    }

    this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
      game_user: respMgr.game_user,
      user_card: respMgr.user_card
    }
  }
};

module.exports = cardmerge;