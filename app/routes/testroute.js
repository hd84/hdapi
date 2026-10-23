var router_lib = require('./lib_route');

class testRouter extends router_lib {
  constructor(){
    super();

    this.getRoute = async function (req, res, param){      
      res.send( "Get SUCCESS" );
    }
  
    this.postRoute = async function (req, res, param){
      res.send( "Post SUCCESS" );  
    }

    this.setInit( this.getRoute, this.postRoute, 1  );    
  } 
};



module.exports = testRouter;