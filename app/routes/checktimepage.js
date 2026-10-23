var express = require('express');
var router = express.Router();

var app = express(); 

function GetCalled(req, res)
{
    
}

// GET  방식으로 넘어 왔을때
router.get('/', function(req, res) 
{
    console.log("GET METHOD");
    
    res.render('checktimepage', { title: 'Game Page' });

});

// POST  방식으로 넘어 왔을때
router.post('/', function(req, res)
{
    console.log("POST METHOD - adminlogin" );
 
    // 실제로는 GET/POST를 아래 코드처럼 위와 동일하게 하지는 않음. 
    // POST는 form에서 날라오는 경우 또는 binary 데이터가 포함되어 있는 경우 일반적 사용   
    if (req.param('type') == 'db')
    {
        GetCalled(req, res);
    }
});


module.exports = router;