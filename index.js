"use strict";

var serveStatic = require("serve-static"),
	http = require("http"),
	finalhandler = require("finalhandler"),
    fs = require('fs');
 
var serve = serveStatic("static/"),
	server = http.createServer(function(req, res) {
		var done = finalhandler(req, res);
		serve(req, res, done);

        // TODO wouldn't it be king-size-deluxe if we made the api restful with express-module?
		if(req.url == "/getNotesFromServer"){
            // console.log("read notes from server called");
            res.writeHead(200, {'Content-Type': 'text/json'});
			var stream = fs.createReadStream("./notes.json" );
			stream.pipe(res);
		} else if(req.url == "/storeNotesOnServer"){
            // console.log("store on server called");
            var body = "";
            req.on('data', function (chunk) {
                body += chunk;
            });
            req.on('end', function () {
                res.end();
                fs.writeFile('notes.json', body , function (err) {
                    if (err) return console.log(err);
                    // console.log('recieved via post: ' + body);
                });

            });
        }
	});
 
server.listen(3000);
