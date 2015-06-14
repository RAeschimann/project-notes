"use strict";

var serveStatic = require("serve-static"),
	http = require("http"),
	finalhandler = require("finalhandler");
 
var serve = serveStatic("static/"),
	server = http.createServer(function(req, res) {
		var done = finalhandler(req, res);
		serve(req, res, done);
	});
 
server.listen(3000);
