const router_lib = require("./lib_route");
const ERR = require("../data/errors");

class jsonload extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res, param) {
      await this.postRoute(req, res, param);
    };

    this.postRoute = async function (req, res, param) {
      var filename = param["filename"];

      global.logger.info("filename=%s", filename);
 
      if (filename != undefined) {
        var addr = "../../json/" + filename;

        
        var jsondata = require(addr);
        res.send(jsondata);
      } else {
        res.send("need param");
      }
    };

    this.setInit(this.getRoute, this.postRoute, 1, true);

    this.REQUEST_DATA = {
      filename: { type: "string", desc: "json file name" }      
    };
  }
}

module.exports = jsonload;