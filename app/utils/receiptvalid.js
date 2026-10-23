var express = require('express');
var router = express.Router();

var global_singleton = require('./global_singleton');             // 전역 변수
var global_util = require('./global_utils');            // utils 함수들 

var g_ = new global_singleton();                                  // 전역 변수 사용 설정
                                                        // 싱글톤이기에 여기서 읽는 것은 start.js에서 셋팅된 값과 동일
var iap = require('in-app-purchase');

var assert = require('assert'); 
var fs = require('fs');

var async = require('async');

var fixedPkPath = process.cwd() + '/googlepublickey/';

exports.ReceiptValid = function(OS, payload, receipt, cb)
{
    var retText = "";
    if( OS == 'IOS')
    {
        if( payload != undefined )
        {
            console.log(payload.toString());
            iap.validate( iap.APPLE, payload, function (err, appleRes) 
            {    
                //에러 발생시 에러 전달
                if (err) 
                {        
                    retText = ({result:false, error:`${err}`});
                    cb(false, { error:`${err}`});
                }

                
                //검증되었는지 확인
                if (iap.isValidated(appleRes)) 
                {
                    console.log( appleRes );
                    retText = ({result:true});
                    cb(true,"");
                }
                else 
                {
                    retText = ({result:false});
                    cb(false,"Not Validated");
                }
            });
        }
    }
    else if( OS == 'ANDROID')
    {
        var objAndroidReceipt = {};
        objAndroidReceipt.data = receipt;
        objAndroidReceipt.signature = payload;
        
        
        iap.reset();
        iap.config({
            verbose: true,
            googlePublicKeyPath: fixedPkPath
        });
    
        iap.setup(function (error) {
            assert.equal(error, undefined);
            var receipt = objAndroidReceipt;
    
            var ty = typeof receipt.data;
            iap.validate(iap.GOOGLE, receipt, function (error, response) {
                // assert.equal(error, undefined);
                // assert.equal(iap.isValidated(response), true);
                //검증되었는지 확인
                if (iap.isValidated(response)) 
                {
                    retText = ({result:true});
                    cb(true,"");
                }
                else 
                {
                    retText = ({result:false});
                    cb(false,"Not Validated");
                }
            });
            
        });
    };
}

var resultText = function(ret)
{
    console.log( ret);
}