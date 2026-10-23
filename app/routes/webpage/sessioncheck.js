
var router_lib = require('../lib_route');

class sessioncheck extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute( req, res, param );
    }

    this.postRoute = async function (req, res, param) {
      let resp = {};      
      resp.username = req.session.username;
      resp.sid = req.session.id;
      // 결과 아웃풋
      res.send(JSON.stringify(resp));
    }

    this.setInit(this.getRoute, this.postRoute, 1);

    this.REQUEST_DATA = {
      username: { type: "string", desc: "user name" },
      
    }
  }
};



module.exports = sessioncheck;