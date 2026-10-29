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
            // 카드 합성을 수동진행
            res.cached.usercard = ret_usercard;            
            if( auto == 0 ){
              try {
                let arr_cards = JSON.parse(cards);
                let obj_use_card = {};
                let rarity = 0;
                let obj_client_card = {};

                // 클라에서 보내준 카드 정보 배열
                // 카드 데이터 체크 및 희귀도 체크
                if( arr_cards && Array.isArray(arr_cards) ){
                  for( const card_row of arr_cards ){
                    let temp_arr = card_row.split( ":" );
                    if( temp_arr.length != 2 ){
                      global.logger.warn("Invalid card format: %s uid : %s", card_row, uid);
                      res.resp.RESULT = ERR.ERROR_CODE.INVALID_PARAMETER;
                    } else {
                      let [card_id, card_count] = temp_arr.map(v => parseInt(v));
                      const card_data = global.GameData["card_data"][card_id];
                      if( card_data == undefined ){
                        global.logger.warn("Invalid card id: %s uid : %s", card_id, uid);
                        res.resp.RESULT = ERR.ERROR_CODE.INVALID_PARAMETER;
                      }
                      if( rarity == 0 ){
                        rarity = card_data.rarity;
                      }

                      if( card_data.rarity == rarity ){
                        obj_use_card[card_id] = (obj_use_card[card_id] || 0) + card_count;
                      } else {
                        global.logger.warn("Card rarity does not match auto: %s uid : %s", card_id, uid);
                        res.resp.RESULT = ERR.ERROR_CODE.INVALID_PARAMETER;
                      }
                      obj_client_card[card_id] = card_count;
                    }
                  }
                }

                // 카드 합성에 사용할 보유카드 수 확인
                if( res.resp.RESULT == ERR.ERROR_CODE.SUCCESS ){
                  let keys = Object.keys(obj_client_card);
                  for( const card_id of keys ){
                    let card_count = obj_client_card[card_id];
                    let ret_resource = await rewardMgr.resourceCheck(res, DEF.REWARD_TYPE.CARD, card_id, card_count);
                    if( ret_resource != true){
                      global.logger.warn("Insufficient card resources: %s uid : %s", card_id, uid);
                      res.resp.RESULT = ERR.ERROR_CODE.NOT_ENOUGH_RESOURCE;
                      break;
                    }
                  }
                }

                // 합성할 카드 차감 목록에 삽입
                if( res.resp.RESULT == ERR.ERROR_CODE.SUCCESS ){
                  let keys = Object.keys(obj_client_card);
                  for( const card_id of keys ){
                    let card_count = obj_client_card[card_id];
                    await rewardMgr.reward( res, DEF.REWARD_TYPE.CARD, parseInt(card_id), -card_count );
                  }
                }
                                 

                // 카드 합성 결과 처리
                if( res.resp.RESULT == ERR.ERROR_CODE.SUCCESS ){
                    let merge_count = 1;                    
                    let merge_result = rewardMgr.card_merge(res, rarity, merge_count);
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
                global.logger.warn("Invalid cards JSON: %s uid : %s", error.message, uid);
                res.resp.RESULT = ERR.ERROR_CODE.INVALID_PARAMETER;
              }             
            } else {       
              // 자동 합성일때                     
              let cards = [];
              for(const card of ret_usercard) {
                if( card.rarity == auto ){
                  for( let i = 0; i < card.count; i++ ){
                    cards.push(card);
                  }
                  
                  if( cards.length < global.config.card_merge_count ){
                    res.resp.RESULT = ERR.ERROR_CODE.NOT_ENOUGH_CARD_MERGE;
                  } else {
                    let remain_card_count = cards.length % global.config.card_merge_count;
                    if( remain_card_count > 0 ){
                      cards.splice( -remain_card_count, remain_card_count);
                    }

                    let merge_count = Math.floor(cards.length / global.config.card_merge_count);
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
      merge_result: respMgr.merge_result,
      reward_list: respMgr.reward_list
    }
  }
};

module.exports = cardmerge;