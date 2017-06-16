var port = 3000;
var serverUrl = "localhost";

console.log("Starting web server at " + serverUrl + ":" + port);

var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var clientPath = path.join(__dirname, '..','client' );
var server = http.createServer(function(req, res) {
    
    var urlData = url.parse(req.url, true);
    var filePath = path.join(clientPath, urlData.pathname);
    var ext = path.extname(filePath) || '.txt';
    
    var validExtension = {
        ".html" : "text/html",
        ".js" : "application/javascript",
        ".css" : "text/css",
    }
    var validExtension = validExtension[ext] || 'text/plain';
     if(req.method === "GET" && req.url === '/' ){
            res.writeHead(200, {"Content-Type" : "text/html"});
            fs.createReadStream(path.join(clientPath,'index.html')).pipe(res);
    }else if(req.method ==="GET" && req.url === '/api/chirps'){
            
                res.writeHead(200, {"Content-Type": "application/JSON"});
                fs.createReadStream('server/data.json').pipe(res);
    }else if(req.method === "GET"){
            var rs = fs.createReadStream(filePath);
            rs.on('error',function(e){
                res.writeHead(404,{"Content-Type" : "text/plain"});
                res.end('file not found');
            });

            res.writeHead(200, {"Content-Type" : validExtension});
            rs.pipe(res);


    }else if(req.method === "POST"){    
        if (req.url === '/api/chirps'){
            var raw = JSON.parse(fs.readFileSync('server/data.json','utf8'));
            var data = '';
            req.on('data', function(d) {
                data += d;
            });
            req.on('end', function() {
                res.writeHead(201, {'Content-Type': 'application/JSON'});
                raw.push(JSON.parse(data));
                json = JSON.stringify(raw);
                fs.writeFileSync('server/data.json', json, 'utf8'); // write it back 
                res.end(data);
            });
        }
    }
});
server.listen(3000);