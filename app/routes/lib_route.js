var express = require('express');

const DEF = require('../data/defines');
const ERR = require('../data/errors');

const userMgr = require('../manager/usermanager');
const Lib_Response = require('../utils/lib_response');

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res); // 여기서 발생되는 에러들은 catch에서 잡힘
    } catch (err) {
      next(err);
    }
  };
};

const reqToParams = (req) => {
  let ret = {};

  if( req.params != undefined && Object.keys(req.params).length > 0 ){
    ret = req.params;
  }

  if( req.body != undefined && Object.keys(req.body).length > 0 ){
    ret = req.body;
  }

  if( req.query != undefined && Object.keys(req.query).length > 0 ){
    ret = req.query;
  }

  return ret;
}
class LibRouter extends express.Router {
  constructor(){
    super();

    this.router_setting = {
      GET_ALLOW : 0,
      SESSION_CHECK : true,
    };

    this.get_route_func = undefined;
    this.post_route_func = undefined;

    this.REQUEST_DATA = {}
    this.RESPONSE_DATA = {}

    this.setInit = function( child_get, child_post, get_allow, session_check = true){
      this.get_route_func = child_get;
      this.post_route_func = child_post;
      this.router_setting.GET_ALLOW = get_allow;
      this.router_setting.SESSION_CHECK = session_check;
      // if( global.config.server_env == "local" ){        
      //   this.router_setting.SESSION_CHECK = false;
      // }
    }

    // 응답 전송이 끝난 뒤 모든 API에서 공통 실행 (성공/실패/세션오류 포함)
    this.afterRoute = async function(req, res){
      // TODO: 공통 종료 처리 (로그, 통계, 캐시 정리 등)
    }

    this.preRoute = async function(req, res){
      Lib_Response.attach(res);
      res.once('finish', () => {
        this.afterRoute(req, res).catch(err => global.logger.error("afterRoute error: %s", err));
      });
      this.ip_check(req);
      await this.session_check(req, res);
      await this.getRequestUserData(req, res);
    }

    this.ip_check = function(req){
      var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();      
      var ip_address = null;
      try {
        ip_address = req.headers['x-forwarded-for'];
      }
      catch (error) {
        ip_address = req.connection.remoteAddress;
      }

      req.ip_address = ip_address;
    }

    this.session_check = async function(req, res){
      res.resp = {RESULT: ERR.ERROR_CODE.SUCCESS};
      let reqparam = reqToParams(req);
      if( res.cached == undefined ){
        res.cached = {};
      }
        
      res.cached.uid = reqparam.uid;

      if( this.router_setting.SESSION_CHECK == true ){
        // 세션 체크 로직 추가 가능          
        let uid = reqparam.uid;
        let session = reqparam.session;
        
        if( global.config.server_env !== "live" && global.config.session_cheat != undefined && global.config.session_cheat == session ){
          res.resp.RESULT = ERR.ERROR_CODE.SUCCESS;
        } else {
          let result = await userMgr.UserSessionCheck(uid, session);
          if( result !== ERR.ERROR_CODE.SUCCESS ){              
            res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_SESSION;         
          } else {              
            res.resp["session"] = reqparam.session;              
          }  
        }                              
      }      
    }

    this.getRequestUserData = async function(req, res){
      if( res.cached.uid != undefined ){
        let ret_gameuser = await userMgr.getUserInfo(res.cached.uid);
        if( ret_gameuser == null ){
          res.resp.RESULT = ERR.ERROR_CODE.NOT_FOUND_USER;          
        } else {
          res.cached.userdata = ret_gameuser;

          res.resp["game_user"] = [];
          res.resp["game_user"].push(res.cached.userdata.toObject());
        }        
      }                  
    }

    this.get("/", asyncHandler( async (req, res)=>{
      if( this.get_route_func != undefined ){
        if( this.router_setting.GET_ALLOW == 1 ){
          // IP 및 세션 확인
          await this.preRoute(req, res);
          
          // 문제 없으면 각 라우트 함수 실행
          if( res.resp.RESULT  == ERR.ERROR_CODE.SUCCESS ){
            this.get_route_func(req, res, reqToParams(req));
          } else {
            res.complete();
          }
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
        // IP 및 세션 확인
        await this.preRoute(req, res);

        // 문제 없으면 각 라우트 함수 실행
        if( res.resp.RESULT  == ERR.ERROR_CODE.SUCCESS ){
          this.post_route_func(req, res, reqToParams(req));
        } else {
          res.complete();
        }
        
      } else {
        res.send('NOT SUPPORTED');
      }      
    }));
  } 
};



module.exports = LibRouter;