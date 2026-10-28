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
      let auto = param['auto'];
      let cards = param['cards'];

      global.logger.info("type1=%s, uid=%s, auto=%s, cards=%s", type1, uid, auto, cards);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {                        
        if( res.cached.userdata != undefined  ){
          res.resp.RESULT = 0;                    
          let ret_usercard = await user_card.getCards(uid);
          if( ret_usercard != undefined ){
            if( auto == 0 ){

            } else {                            
              let cards = [];
              for(const card of ret_usercard) {
                if( card.rarity == auto ){
                  for( let i = 0; i < card.count; i++ ){
                    cards.push(card);
                  }
                  
                  let remain_card_count = cards.length % 4;
                  if( remain_card_count > 0 ){
                    cards.splice( -remain_card_count, remain_card_count);
                  }

                  let merge_count = Math.floor(cards.length / 4);
                  let merge_result = rewardMgr.card_merge(res, auto, merge_count);

                  if( merge_result.success.length > 0 ){
                    for( let i = 0; i < merge_result.success.length; i++ ){
                      await rewardMgr.reward( res, DEF.REWARD_TYPE.CARD, merge_result.success[i], 1 );
                    }                    
                  } 

                  if( merge_result.fail.length > 0 ){
                    for( let i = 0; i < merge_result.fail.length; i++ ){
                      await rewardMgr.reward( res, DEF.REWARD_TYPE.CARD, merge_result.fail[i], 1 );
                    }                    
                  } 

                  res.resp["merge_result"] = merge_result;
                  // else {
                  //   res.resp.RESULT = ERR.ERROR_CODE.NOT_ENOUGH_CARD_MERGE;
                  // }
                }
              }
            }
          }
                    
          res.complete();
          
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