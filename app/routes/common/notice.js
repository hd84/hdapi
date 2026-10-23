const router_lib = require('../lib_route');

class notice extends router_lib {
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
                notice: [],
            };
            
            global.noticedata.forEach(({ idx, noticetext }) => {
                resp.notice.push({ idx, noticetext });
            });

            res.send(JSON.stringify(resp));
        };

        this.setInit(this.getRoute, this.postRoute, 1, false );

        this.REQUEST_DATA = {        
        };
    }
}

module.exports = notice;