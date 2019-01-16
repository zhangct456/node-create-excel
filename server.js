var express = require('express');
var bodyParser = require('body-parser');
var router = require('./js/router');

var app = express();

app.use(bodyParser());
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(router);

app.listen(9999);                  // startup our app at http://localhost:9999
console.log("http start at port 9999");