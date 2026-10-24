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
                result: {},
            };
            
            //global.MapRouter[main_cate][api_name]["REQUEST_DATA"] = route_obj.REQUEST_DATA;
            //global.MapRouter[main_cate][api_name]["RESPONSE_DATA"] = route_obj.RESPONSE_DATA;

            Object.keys(global.MapRouter).forEach(main_cate => {
                Object.keys(global.MapRouter[main_cate]).forEach(api_name => {                   
                    let apiname = `${main_cate}/${api_name}`;
                    resp.result[apiname] = {
                        REQUEST_DATA: global.MapRouter[main_cate][api_name].REQUEST_DATA,
                        RESPONSE_DATA: global.MapRouter[main_cate][api_name].RESPONSE_DATA,
                    };
                });
            });

            

            res.send(JSON.stringify(resp));
        };

        this.setInit(this.getRoute, this.postRoute, 1, false );

        this.REQUEST_DATA = {        
        };
    }
}

module.exports = notice;