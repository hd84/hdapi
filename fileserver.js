var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer(function (request, response) {
    console.log('request ', request.url);

    var filePath = '.' + request.url;
    if (filePath == './')
        filePath = './index.html';

    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = 'text/html';
    var mimeTypes = {
        '.html': 'text/html',
        '.txt': 'text/html',
        '.asp': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml',
        '.zip': 'application/octet-stream',
        '.asp': 'text/html',
    };

    //contentType = mimeTypes[extname] || 'application/octet-stream';
    contentType = mimeTypes[extname];

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {            
            var stat =fs.statSync( filePath );
            response.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stat.size });
            response.end(content, 'utf-8');
        }
    });

}).listen(8007);
console.log('Server running at http://127.0.0.1:8007/');


function solution(plans) {
    var answer = [];
    
    var extarr = [];
    for( let i = 0; i < plans.length; i++ ){
        let tempone = plans[i];
        const arrtime = tempone[1].split(":");
        let starttime = 60 * parseInt(arrtime[0]) + parseInt(arrtime[1]);
        let remaintime = parseInt(tempone[2]);        
        tempone.push( starttime );
        tempone.push( remaintime );
    }
    
   
    plans.sort( function(a,b){
           if(a[3] > b[3]) return 1;
           if(a[3] === b[3]) return 0;
           if(a[3] < b[3]) return -1;
        });
    
    let curtime = 0;    
    for( let i = 0; i < plans.length; i++ ){
        console.log( plans[i]);
        if( i + 1 < plans.length ){
            if( plans[i][3] + plans[i][4] <= plans[i+1][3] ){
                plans[i][3] = 0;
                answer.push( plans[i][0]);                
                curtime = plans[i][3] + plans[i][4];
                
                if( extarr.length > 0 ){
                    for( let j = extarr.length - 1; j >= 0; j-- ){
                        
                    }    
                }

            } else {
                plans[i][4] -= plans[i+1][3] - plans[i][3];            
                extarr.push( plans[i] );
                curtime = plans[i+1][3];
            }            
        }
    }

    while( answer.length == plans.length - 1 ){
        for( let i = plans.length - 1; i >= 0; i-- ){
            if( plans[i][4] > 0 ){
                answer.push( plans[i][0])
            }
        }
    }
    
    
    return answer;
}
