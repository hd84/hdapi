const ERR = require('../data/errors');
const DEF = require('../data/defines');

const user_card = require('../../table/user_card');

exports.reward = async function( res, type, value, count ) {
  console.log(`Rewarding: type=${type}, value=${value}, count=${count}`);

  const num_type = parseInt(type);
  const num_value = parseInt(value);
  const num_count = parseInt(count);

  let userdata = res.cached.userdata;

  if ( !userdata ) {
    res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;
    return;
  }

  if( res.cached.reward == undefined ){
    res.cached.reward = [];
  }

  if( res.cached.reward_count == undefined ){
    res.cached.reward_count = {};
  }
  res.cached.reward.push({type: num_type, value: num_value, count: num_count});
  res.cached.reward_count[num_type] = (res.cached.reward_count[num_type] || 0) + 1;  
}

exports.resourceCheck = async function( res, type, value, count ) {
  // Implement resource check logic if needed
  let userdata = res.cached.userdata;
  if ( !userdata ) {
    res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;
    return false;
  }

  switch ( parseInt(type) ) {
    case DEF.REWARD_TYPE.GOLD:
      return (userdata.gold || 0) >= count;
    case DEF.REWARD_TYPE.GEM_PAID:
      return (userdata.gem_paid || 0) >= count;
    case DEF.REWARD_TYPE.GEM_FREE:
      return (userdata.gem_free || 0) >= count;
    default:
      return false;
  }
  
}
exports.rewardComplete = async function( res ) {
  let user_card_object = {};
  let user_card_list = [];
  if( res.cached.reward == undefined || res.cached.reward.length == 0 ){
    return;
  }

  let insert_card_list = [];
  let update_card_list = [];
  if( res.cached.reward_count != undefined  ){
    if( res.cached.reward_count[DEF.REWARD_TYPE.CARD] != undefined && res.cached.reward_count[DEF.REWARD_TYPE.CARD] > 0 ){
      user_card_list = await user_card.getCards(res.cached.uid);
      user_card_list.forEach(card => {
        user_card_object[card.did] = card;
      });

    }
  }

  for(const reward of res.cached.reward){
    const {type, value, count} = reward;
    switch ( parseInt(type) ) {
      case DEF.REWARD_TYPE.GOLD:
        res.cached.userdata.gold = (res.cached.userdata.gold || 0) + count;
        break;
      case DEF.REWARD_TYPE.GEM_PAID:      
        res.cached.userdata.gem_paid = res.cached.userdata.gem_paid + count;
        break;
      case DEF.REWARD_TYPE.GEM_FREE:      
        res.cached.userdata.gem_free = res.cached.userdata.gem_free + count;
        break;
      case DEF.REWARD_TYPE.CARD:
        if( user_card_object[value] != undefined ){
          user_card_object[value].count = user_card_object[value].count + count;
          update_card_list.push(user_card_object[value]);
        } else {
          let tempUserCard = await user_card.tempUserCard(res.cached.uid, value, count);
          insert_card_list.push(tempUserCard);
        }
        break;
      default:        
        return;
    }
  }

  await res.cached.userdata.updateData();
  if( insert_card_list.length > 0 ){
    await user_card.insertList(insert_card_list);
  }
  if( update_card_list.length > 0 ){
    await user_card.updateList(update_card_list);
  }
  // switch block removed, handled in forEach above
}