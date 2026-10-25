const router_lib = require('../lib_route');
const ERR = require('../../data/errors');
const DEF = require('../../data/defines');
const commonfunc = require('../common/commonfunc');

const common_users = require('../../../table/common_users');
const user_card = require('../../../table/user_card');

const userMgr = require('../../manager/usermanager');
const respMgr = require('../../manager/responsemanager');
const rewardMgr = require('../../manager/rewardmanager');

class buygoods extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      let type1 = param['type'];
      let uid = param['uid'];
      let goods_id = param['goods_id'];

      global.logger.info("type1=%s, uid=%s, goods_id=%s", type1, uid, goods_id);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {                        
        if( res.cached.userdata != undefined  ){
          res.resp.RESULT = 0;                    
          
          const goods_data = global.GameData["shop_goods_data"].find(g => g.idx == goods_id);

          let resourceCheckResult = await rewardMgr.resourceCheck(res, goods_data.use_type, goods_data.use_value, goods_data.use_count);
          if( resourceCheckResult == false ){
            res.resp.RESULT = ERR.ERROR_CODE.NOT_ENOUGH_RESOURCE;
            res.send(JSON.stringify(res.resp));
            return;
          }

          await rewardMgr.reward( res, goods_data.use_type, goods_data.use_value, -goods_data.use_count );

          if( goods_data.type == DEF.SHOP_GOODS_TYPE.GACHA){            
            await rewardMgr.gacha(res, goods_data.reward_id);
            await rewardMgr.rewardComplete(res);        
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
      goods_id: { type: "number", desc: "goods id" }
    }

    this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
      game_user: respMgr.game_user,      
      reward_list: respMgr.reward_list,
    }
  }
};

module.exports = buygoods;