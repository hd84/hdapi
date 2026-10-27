var express = require('express');
var session = require('express-session');
var path = require('path');

var fs = require('fs');
var util = require('util');
var tknstr = require('querystring');
var async = require('async');
var readline = require('readline');                 // 키보드 입력

// 해동 추가 설치 모듈
var fsextra = require('fs-extra');
var bodyParser = require('body-parser');

const SQL_Query = require('./app/utils/sqlquery.js');        // sql query 함수들이 들어 있다.
const redis = require('redis');
const RedisClient = require('./app/utils/redisclient.js');

const datetime = require('./app/utils/datetime');

const schedule = require('./app/utils/schedule');
const unityGenerator = require('./app/utils/unitygenerator');

// DB npm 모듈
const knex = require('knex');

// 라우팅 패킷
var routes = require('./app/routes/index');             // 각각의 URL 호출에 대한 대등 페이지 정의

// 해동 추가 패킷
var jsonload = require('./app/routes/jsonload');

const commonfunc = require('./app/routes/common/commonfunc');

var checktimepage = require('./app/routes/checktimepage');

/////////////////////////////////////////////////////////////////////
var app = express();

global.config = {};

const args = process.argv;

async function appInit() {
  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.use(express.static(path.join(__dirname, 'public')));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(require('req-param'));

  setRoute();

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

  global.logger.info("NODE.JS EXPRESS started: time:%s", datetime.formatDateTime(datetime.now()));
}

async function DB_MySQL_Init() {
  if (global.config.db != undefined) {
    let keys = Object.keys(global.config.db);
    keys.forEach(key => {
      if (key == "mysql") {
        let mysql_keys = Object.keys(global.config.db[key]);
        mysql_keys.forEach(mysql_key => {
          if (Array.isArray(global.config.db[key][mysql_key]) == true) {
            global.config.db[key][mysql_key].forEach(dbConfig => {
              let knexDb = knex({
                client: 'mysql2',
                connection: { host: dbConfig.host, user: dbConfig.user, password: dbConfig.password, database: dbConfig.db },
                pool: { min: 0, max: dbConfig.connectionLimit || 10 }
              });

              if (global.DB == undefined) {
                global.DB = {};
              }

              if (global.DB[mysql_key] == undefined) {
                global.DB[mysql_key] = [];
              }

              global.DB[mysql_key].push(knexDb);
            });
            return;
          }
        });
      }
    });
  }
}

async function DB_Redis_Init(params) {
  const redisConfig = global.config.db && global.config.db.redis;
  if (redisConfig) {
    global.REDIS = global.REDIS || {};

    for (const redis_key of Object.keys(redisConfig)) {
      const dbConfigs = redisConfig[redis_key];
      if (!Array.isArray(dbConfigs)) {
        continue;
      }

      global.REDIS[redis_key] = global.REDIS[redis_key] || [];

      for (const dbConfig of dbConfigs) {
        const clientOptions = {
          socket: {
            host: dbConfig.host,
            port: dbConfig.port || 6379
          }
        };

        if (dbConfig.password) {
          clientOptions.password = dbConfig.password;
        }
        if (dbConfig.db !== undefined) {
          clientOptions.database = dbConfig.db;
        }

        const redisClient = redis.createClient(clientOptions);
        redisClient.on('error', err => {
          global.logger.error('[REDIS:' + redis_key + '] client error:', err);
        });

        global.REDIS[redis_key].push(new RedisClient(redisClient));
        await redisClient.connect();
        global.logger.info('[REDIS:' + redis_key + '] connected to ' + dbConfig.host + ':' + (dbConfig.port || 6379));
      }
    }
  }

  const redisGame = commonfunc.getRedisGame(0);
  await redisGame.allkeysAsync();
}

// 초기화 정보 셋팅
async function _sysInit() {
  config_args_parse();

  await DB_MySQL_Init();
  await DB_Redis_Init();

  appInit();

  await _server_init();
}

function config_args_parse() {
  global.launch_config_args = {};

  if (args != undefined && args.length > 0) {
    for (let i = 0; i < args.length; i += 2) {
      if (args[i].startsWith("--") == true) {
        global.launch_config_args[args[i].slice(2, args[i].length)] = args[i + 1];
      }
    }
  }

  const default_config_file = "config.json";

  let filename = global.launch_config_args["config"];
  if (filename == undefined) {
    filename = default_config_file;
  }

  let mode = global.launch_config_args["mode"];
  if (mode == undefined) {
    global.launch_config_args["mode"] = "api";
  }

  // 기본 config 정보
  var readbuffer = fs.readFileSync(default_config_file).toString();
  global.config = JSON.parse(readbuffer);

  // 환경별 추가 config 정보
  readbuffer = fs.readFileSync(filename).toString();
  Object.assign(global.config, JSON.parse(readbuffer));

  // DB 접속 연결 정보
  readbuffer = fs.readFileSync(global.config.db_config).toString();
  global.config.db = JSON.parse(readbuffer);

  const Logger = require('./app/utils/logger.js').logger;        // log4js module
  global.logger = Logger;
  global.logger.info("Logger initialized.");

  global.SQL_Query = SQL_Query;
}

// WEB 서버 실행
async function _server_init() {
  await _setDefinedata();

  loadJsonData();
}

// 메인 구문
async function _main() {
  // 현재는 작업 없음
  if (global.launch_config_args["mode"] == undefined || global.launch_config_args["mode"] === "api") {
    await commonfunc.GetCurrentStar();
    await commonfunc.GetNotice();

    schedule._scheduleRegister();
    GameServerStart();

    global.logger.info("Server env: %s", global.config.server_env);
  } else if (global.launch_config_args["mode"] === "unityreq") {
    appInit();
    global.logger.info("Server Mode: %s", global.launch_config_args["mode"]);

    unityGenerator.CreateUnityRequestFile(global.MapRouter);
    unityGenerator.CreateUnityHTTPRequestMgrFile(global.MapRouter);
    process.exit(1);
    // Unity request mode handling
  } else if( global.launch_config_args["mode"] === "jsonmerge") {
    const jsonmerge = require('./app/utils/jsonmerge.js');
    jsonmerge.mergejson();
    process.exit(1);
  }
}

async function _setDefinedata() {
  const TB_DEFINE = require('./table/tb_define.js');
  const defineData = await TB_DEFINE.getDefineData();
  if (defineData != undefined) {
    global.GAME_DEFINE = {};

    defineData.forEach(row => {
      global.GAME_DEFINE[row.name] = row.value;
    });
  } else {
    global.GAME_DEFINE = {};
  }
}

function GameServerStart() {
  var hostIP = global.config.serverIP.split('.');
  var hostPORT = global.config.serverPORT;

  // app의 listen()에는 createServer() 가 포함됨
  app.listen(hostPORT);
  global.logger.info("WEB SERVER started: time:%s, port:%d, sv ip:%s", datetime.formatDateTime(datetime.now()), hostPORT, hostIP);
  global.logger.info("SERVER Version: %s", global.config.version);
}

function setRoute() {
  // get, post의 호출 이름(.js의 이름 또는 url이름)에 따른 모듈 지정
  app.use('/', routes);

  addRouter('auth/finduser');
  addRouter('auth/gamelogin');

  addRouter('user/userinfo');
  addRouter('user/cards');
  addRouter('user/characters');

  addRouter('shop/buygoods');
  addRouter('shop/goodslist');

  addRouter('common/notice');
  addRouter('common/packetjson');

  addRouter('webpage/weblogin', false);
  addRouter('webpage/webmain', false);
  addRouter('webpage/sessioncheck', false);

  addRouter('servertime');

  addRouter('jsonload');
}

function addRouter(routeName, restful_visible = true) {
  let defaultPath = './app/routes/';
  let add_one = new (require(defaultPath + routeName));

  if (restful_visible == true) {
    addRouteMap(routeName, add_one);
  }

  app.use("/" + routeName, add_one);
}

function addRouteMap(routeName, route_obj) {
  let arr_name = routeName.split("/");
  let main_cate = "";
  let api_name = "";
  if (global.MapRouter == undefined) {
    global.MapRouter = {};
  }

  if (arr_name.length <= 1) {
    main_cate = "root";
    api_name = arr_name[0];
  } else {
    main_cate = arr_name[0];
    api_name = arr_name[1];
  }

  if (global.MapRouter[main_cate] == undefined) {
    global.MapRouter[main_cate] = {};
  }

  if (global.MapRouter[main_cate][api_name] == undefined) {
    global.MapRouter[main_cate][api_name] = {};
  }

  global.MapRouter[main_cate][api_name]["REQUEST_DATA"] = route_obj.REQUEST_DATA;
  global.MapRouter[main_cate][api_name]["RESPONSE_DATA"] = route_obj.RESPONSE_DATA;
}

function GetServerMode() {
  return global.launch_config_args["mode"];
}

function loadJsonData() {
  global.GameData = {};

  try {
    global.GameData = JSON.parse(fs.readFileSync(path.join(__dirname, 'json', 'merged.json'), 'utf8'));
  } catch (err) {
    global.logger.error("JSON load failed: merged.json, %s", err.message);
  }

  global.logger.info("GameData loaded: %s", Object.keys(global.GameData).join(', '));
}
// 초기화
_sysInit();

// 메인 실행문
_main();

module.exports = app;