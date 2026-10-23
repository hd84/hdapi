const tb_notice = require('../../../table/tb_notice');

exports.GetCurrentStar = async function () {
  const arr_star = [3, 4, 1, 2, 6, 5, 7];
  const now = new Date();
  const today = now.getDay();
  const starttime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endtime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const stardata = {
    star: arr_star[today],
    starttime: starttime,
    endtime: endtime,
  };

  global.stardata = stardata;

  return stardata.star;
}


exports.GetNotice = async function () {
  if( global.noticedata == undefined ){
    global.noticedata = [];
  }    

  let ret = await tb_notice.GetNoticeData();  
  if (Array.isArray(ret)) {    
    for (const noticedata of ret) {
      global.noticedata.push({ idx: noticedata.idx, noticetext: noticedata.noticetext });
    }
  }

  return ret;
}

exports.getRedisGame = function ( shardkey ) {  
  if( shardkey == undefined )
    shardkey = 0;
  
  return global.REDIS["GAME"][shardkey % global.REDIS["GAME"].length];
}