"use strict";
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var router = express.Router();

app.use(require('./routes/routes.js'));
app.use(express.static(__dirname + '/static'));

http.createServer(app).listen(3000);

