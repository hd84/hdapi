const router_lib = require('../lib_route');
const ERR = require('../../data/errors');
const DEF = require('../../data/defines');
const commonfunc = require('../common/commonfunc');

const common_users = require('../../../table/common_users');
const user_card = require('../../../table/user_card');

const userMgr = require('../../manager/usermanager');
const respMgr = require('../../manager/responsemanager');
const rewardMgr = require('../../manager/rewardmanager');

class goodslist extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      let type1 = param['type'];
      let uid = param['uid'];      

      global.logger.info("type1=%s, uid=%s", type1, uid);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {                        
        if( res.cached.userdata != undefined  ){
          res.resp.RESULT = 0;                    
          
          res.resp.shop_goods_list = global.GameData["shop_goods_data"];
          //const goods_data = global.GameData["shop_goods_data"].find(g => g.idx == goods_id);
        } else {
          res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;
        }
        res.complete();
      } else {
        res.completeText('ERROR check type and subtype');
      }
              
    }

    this.setInit(this.getRoute, this.postRoute, 1, true);

    this.REQUEST_DATA = {
      session: { type: "string", desc: "user session" },
      uid: { type: "number", desc: "user id" }
    }

    this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
      game_user: respMgr.game_user,      
      shop_goods_list: respMgr.shop_goods_list,
    }
  }
};

module.exports = goodslist;