var express = require('express');
var app = new express();
var bodyparser = require('body-parser');
var route = require('./route');

var urlencodedParser = bodyparser.urlencoded({extended:true});

app.set('view engine','jade');
app.set('views','./views/pages');
app.use('/public',express.static(__dirname+"/public"));

route(app);

//---------------------测试-------------------
app.get("/charactertest",function (req,res) {
    res.sendFile(__dirname+"/characterTest.html");
});

app.listen(8081,function () {
    console.log("--------------dnf web启动中-----------");
});