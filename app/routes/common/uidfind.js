const router_lib = require('../lib_route');

const tb_common_users = require('../../../table/common_users');

class uidfind extends router_lib {
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

            const resp = {
                RESULT: 0,
                user: [],
            };
            
            let user = await tb_common_users.getUserByUid(param.uid);
            
            if ( user != undefined ) {
                user.updateCountry(req.geo ? req.geo.country : "ZZ");
                let ret = await user.updateData();
                resp.user.push(user.toObject());
            }


            res.send(JSON.stringify(resp));
        };

        this.setInit(this.getRoute, this.postRoute, 1);

        this.REQUEST_DATA = {      
            uid: { type: "number", desc: "uid" }            
        };
    }
}

module.exports = uidfind;