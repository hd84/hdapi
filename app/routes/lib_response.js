var express = require('express');
var router = express.Router();

class LibResponse extends express.Router {
  constructor(){
    super();

    this.router_setting = {
      GET_ALLOW : 0,      
    };

    this.get_route_func = undefined;
    this.post_route_func = undefined;

    this.setInit = function( child_get, child_post, get_allow ){
      this.get_route_func = child_get;
      this.post_route_func = child_post;
      this.router_setting.GET_ALLOW = get_allow;
    }
    

    this.get("/", asyncHandler( async (req, res)=>{
      if( this.get_route_func != undefined ){
        if( this.router_setting.GET_ALLOW == 1 ){
          //this.processRoute(req, res);
          this.get_route_func(req, res, req.query);
        } else{
          res.send('NOT SUPPORTED');
        }
      } else{
        res.send('NOT SUPPORTED');
      }
    }));
    
    this.post("/", asyncHandler( async (req, res)=>{
      //do something
      if( this.post_route_func != undefined ){
        this.post_route_func(req, res, req.query);
      } else {
        res.send('NOT SUPPORTED');
      }      
    }));
  } 
};



module.exports = LibResponse;