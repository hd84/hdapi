// 최초 들어 올때 SUB URL 없이 들어오면 기본 페이지

var express = require('express');
var router = express.Router();

const telegram = require('../utils/telegram');

/* GET home page. */
router.get('/', function (req, res) {
  //var sid = req.cookies.sid;
  var msg = '';
  var errCode = '';

  res.render('index', { title: 'GameSv', msg: msg, errCode: errCode, mapRoute: global.MapRouter, version: global.config.version });

});

router.get('/restful', async function (req, res) {
  //var sid = req.cookies.sid;
  var msg = '';
  var errCode = '';

  var server_env = global.config.server_env;
  // 프록시를 거치는 경우 x-forwarded-for의 첫번째 IP가 실제 클라이언트 IP
  var clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip;

  if( server_env != "local" ){
    await telegram.sendMessage('7982261390:AAH3ZXr_vxAGedUy0vrmEi_e5mSjtFu1Kfo', '-4532049856', `[[${server_env}]] restful page access\n IP: ${clientIp}`, { parse_mode: 'Markdown' });
  }
  
  res.render('restful', { title: 'GameSv', msg: msg, errCode: errCode, mapRoute: global.MapRouter, version: global.config.version });

});

router.get('/login', function (req, res) {
  //var sid = req.cookies.sid;
  var msg = '';
  var errCode = '';
  
  let arr_schedule = [];

  
  //res.render('index', { title: 'GameSv', msg: msg, errCode: errCode, mapRoute: global.MapRouter, version: global.config.version });
  res.render('login', { title: 'login', session : req.session });
});

router.get('/xlsxjson', function (req, res) {
  //var sid = req.cookies.sid;
  var msg = '';
  var errCode = '';

  res.render('xlsxjson', { title: 'xlsxjson', msg: msg, errCode: errCode, mapRoute: global.MapRouter, version: global.config.version });

});

router.get('/insertquery', function (req, res) {
  //var sid = req.cookies.sid;
  var msg = '';
  var errCode = '';

  res.render('insertquery', { title: 'insertquery', msg: msg, errCode: errCode, mapRoute: global.MapRouter, version: global.config.version });

});

router.get('/func', function (req, res) {
  res.render('func', { title: 'func' });
});

router.get('/cookie', function (req, res) {
  res.render('cookie');
});



module.exports = router;
