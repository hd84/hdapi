const router_lib = require('../lib_route');

const user_info = require('../../../table/user_info');
const respMgr = require('../../manager/responsemanager');

class userinfo extends router_lib {
    constructor() {
        super();

        this.getRoute = async function (req, res, param) {
            await this.postRoute(req, res, param);
        };

        this.postRoute = async function (req, res, param) {
            const type = param.type;

            if (type !== 'db') {
                return res.send('ERROR check type and subtype');
            }

            if( res.resp == undefined ){
                res.resp = {};
            }
            res.resp.RESULT = 0;
            res.resp["game_user"] = [];
            let user = await user_info.getUserByUid(param.uid);            
            res.resp.game_user.push(user.toObject());


            res.send(JSON.stringify(res.resp));
        };

        this.setInit(this.getRoute, this.postRoute, 1,false);

        this.REQUEST_DATA = {      
            uid: { type: "number", desc: "uid" }            
        };

        this.RESPONSE_DATA = {
      RESULT:{ type: "number", desc : "result code" },
            game_user: respMgr.game_user,
        };
    }
}

module.exports = userinfo;