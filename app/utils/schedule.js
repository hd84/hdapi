const schedule = require('node-schedule');
const util = require('util');

const commonfunc = require('../routes/common/commonfunc');

exports._scheduleRegister = function() {

  var scheduleStar = schedule.scheduleJob('0 0 * * * *', function () {
    _setStardata();    
  });

  
  var scheduleUserCount2 = schedule.scheduleJob('0 10 * * * *', function () {
    _setUserCountCheck();
  });

  var scheduleNotice = schedule.scheduleJob('0 * * * * *', function () {
    _setNoticedata();
  });

}

function _setUserCountCheck() {
  const redisGame = commonfunc.getRedisGame();
  redisGame.getkeys("session-*", function (err, reply) {
    if (err == null) {
      var usercount = reply.length;
      global.logger.info("Current user count: %d", usercount);
    }
  });
}

async function _setStardata() {
  commonfunc.GetCurrentStar();
}

function _setNoticedata() {
  commonfunc.GetNotice();
}
