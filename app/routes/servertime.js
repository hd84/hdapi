var express = require('express');
var router = express.Router();

var dateFormat = require('dateformat');

var router_lib = require('./lib_route');

class servertime extends router_lib {
  constructor(){
    super();
  
    this.getRoute = async function (req, res, param){
        var day=dateFormat(new Date(), "ddd yyyy/mm/dd hh:MM:ss TT");
        let obj = { date: day };
        res.send(obj);
    }
  
    this.postRoute = async function (req, res, param){                
        var day=dateFormat(new Date(), "ddd yyyy/mm/dd hh:MM:ss TT");
        let obj = { date: day };
        res.send(obj);
    }

    this.setInit( this.getRoute, this.postRoute, 1, false );    

    this.REQUEST_DATA = {
      userid : { type : "number", desc : "user id" }
    }
  } 
};


module.exports = servertime;