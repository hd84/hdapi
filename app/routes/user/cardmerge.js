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
              try {
                let arr_cards = JSON.parse(cards);
                let obj_use_card = {};

                if( arr_cards && Array.isArray(arr_cards) ){
                  for( const card_row of arr_cards ){
                    // 여기서 card_row를 처리하는 로직을 추가해야 함
                    let temp_arr = card_row.split( ":" );
                    if( temp_arr.length != 2 ){
                      global.logger.warn("Invalid card format: %s", card_row);
                      res.resp.RESULT = ERR.ERROR_CODE.INVALID_PARAMETER;
                    } else {
                      let card_id = parseInt(temp_arr[0]);
                      let card_count = parseInt(temp_arr[1], 10);
                      if( isNaN(card_count) || card_count <= 0 ){
                        global.logger.warn("Invalid card count: %s", temp_arr[1]);
                        res.resp.RESULT = ERR.ERROR_CODE.INVALID_PARAMETER;
                      } else {
                        obj_use_card[card_id] = (obj_use_card[card_id] || 0) + card_count;
                      }
                    }
                  }

                  let keys = Object.keys(obj_use_card);
                  for( const card_id of keys ){
                    let card_count = obj_use_card[card_id];
                    await rewardMgr.reward( res, DEF.REWARD_TYPE.CARD, parseInt(card_id), -card_count );
                  }
                }       
                
                if( res.resp.RESULT == ERR.ERROR_CODE.SUCCESS ){
                    let merge_count = 1;
                    let card_id = Object.keys(obj_use_card)[0];
                    const card_data = global.GameData["card_data"][card_id];
                    let merge_result = rewardMgr.card_merge(res, card_data.rarity, merge_count);
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
                }
              } catch (error) {
                global.logger.warn("Invalid cards JSON: %s", error.message);
                res.resp.RESULT = ERR.ERROR_CODE.INVALID_PARAMETER;
              }

              
            } else {                            
              let cards = [];
              for(const card of ret_usercard) {
                if( card.rarity == auto ){
                  for( let i = 0; i < card.count; i++ ){
                    cards.push(card);
                  }
                  
                  if( cards.length < 4 ){
                    res.resp.RESULT = ERR.ERROR_CODE.NOT_ENOUGH_CARD_MERGE;
                  } else {
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
                  }
                  
                }
              }
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
      auto : { type:"number", desc : "auto merge flag 0- false, 1 > rarity" },
      cards: { type: "string", desc: "JSON array of user card strings when auto is 0, e.g. [\"4001:1\",\"4002:3\"]" }
    }

    this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
      game_user: respMgr.game_user,
      user_card: respMgr.user_card
    }
  }
};

module.exports = cardmerge;