var router_lib = require('../lib_route');

const DEF = require('../../data/defines');
const ERR = require('../../data/errors');

const user_channel = require('../../../table/user_channel');

const respMgr = require('../../manager/responsemanager');

class finduser extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      var type1 = param['type'];
      var ch = param['ch'];
      var cid = param['cid'];      
      var deviceid = param['deviceid'];

      global.logger.info("type1=%s, deviceid=%s", type1, deviceid);

      // db에 있는 데이터 읽어서 보낼때
      if (type1 == 'db') {        
        var resp = {};  // response 되는 패킷의 내용을 정의

        let ret = await user_channel.getUserByChannel(ch, cid);
        if( ret == undefined || ret.length == 0 ){          
          ret = await user_channel.newUserChannel(DEF.CHANNEL_TYPE.GUEST, cid, deviceid);         
        }

        if( ret != undefined && ret != null ){
          resp.RESULT = 0;
          resp["user_channel"] = [];
          resp["user_channel"].push(ret.toObject());
        } else {
          resp.RESULT = -1;
        }
        
        res.send(JSON.stringify(resp));
      }
      else {
        res.send('ERROR check type and subtype');
      }
    }

    this.setInit(this.getRoute, this.postRoute, 1, false);

    this.REQUEST_DATA = {
      ch: { type: "number", desc: "channel 0:GUEST, 1:APPLE, 2:GOOGLE" },
      cid: { type: "string", desc: "cid" },
      deviceid: { type: "string", desc: "deviceid" }            
    }

    this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
      user_channel: respMgr.user_channel
    }
  }
};

module.exports = finduser;