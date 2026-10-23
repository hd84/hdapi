var express = require('express');
var router = express.Router();

const userMgr = require('../../manager/usermanager');

const moment = require('moment-timezone');
  
var router_lib = require('../lib_route');
const tb_web_account = require('../../../table/tb_web_account');

class weblogin extends router_lib {
  constructor() {
    super();

    moment.tz.setDefault("Asia/Seoul");
    
    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      let resp = {};
      
      let ret = await tb_web_account.getWebAccountData(param["username"]);
      let count = ret.length;
      resp.RESULT = count > 0 ?  count:null;

      req.session.username = req.body.username;

      let loginsession = await userMgr.getWebUserLoginSessionRedis(req.session.id );
      if( loginsession == undefined ){

      }

      // 결과 아웃풋
      res.send(JSON.stringify(resp));
    }

    this.setInit(this.getRoute, this.postRoute, 1);

    this.REQUEST_DATA = {
      username: { type: "string", desc: "user name" },
      password: { type: "string", desc: "password" },      
    }
  }
};



module.exports = weblogin;