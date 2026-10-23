var router_lib = require('../lib_route');

class webmain extends router_lib {
  constructor() {
    super();

    this.getRoute = async function (req, res) {
      if (!req.session.username) {
        return res.redirect('/webpage/login');
      }

      res.render('webmain', { userid: req.session.username });
    };

    this.setInit(this.getRoute, undefined, 1);
  }
}

module.exports = webmain;
