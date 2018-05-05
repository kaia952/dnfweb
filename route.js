var bodyparser = require('body-parser');
var user = require("./users");
var urlencodedParser = bodyparser.urlencoded({extended:true});

module.exports = function (app) {

//----------------------首页---------------------
    app.get("/",user.Index);

//---------------------角色页、地理页、地下城页、事件页--------------------
    app.get("/characterlist/:page",user.characterList);
    app.get("/characterlist",user.characterList);
    app.get("/geographylist",user.geographyList);
    app.get("/dungeonlist",user.dungeonList);
    app.get("/eventslist",user.eventsList);

//---------------------角色上传页面---------------------
    app.get("/admin/uploadCharacter",user.uploadCharacter);
    app.post("/admin/uploadNewCharacter",urlencodedParser,user.uploadCharacterHandler);

//-------------------角色修改页面------------------------
    app.get('/admin/modifyCharacter/:name',user.modifyCharacter);
    app.post("/admin/modifyExistCharacter",urlencodedParser,user.modifyCharacterHandler);

//-------------------角色页面-----------------------
    app.get("/character/:name",user.character);

//-------------------------地理上传---------------------
    app.get("/admin/uploadGeography",user.uploadGeography);
    app.post("/admin/uploadNewGeography",urlencodedParser,user.uploadGeographyHandler);

//------------------------地理修改-----------------------
    app.get("/admin/modifyGeography/:name",user.modifyGeography);
    app.post("/admin/modifyExistGeography",urlencodedParser,user.modifyGeographyHandler);

//--------------地理页面-------------------
    app.get("/geography/:name",user.geography);

//-------------------------地下城上传---------------------
    app.get("/admin/uploadDungeon",user.uploadDungeon);
    app.post("/admin/uploadNewDungeon",urlencodedParser,user.uploadDungeonHandler);

//------------------------地下城修改-----------------------
    app.get("/admin/modifyDungeon/:name",user.modifyDungeon);
    app.post("/admin/modifyExistDungeon",urlencodedParser,user.modifyDungeonHandler);

//--------------地下城页面-------------------
    app.get("/dungeon/:name",user.dungeon);

//----------------首页搜索及列表页分类----------------------
    app.get("/search",user.search);
    app.get("/sortCharacter",user.sortCharacter);

//---------------注册及登录----------------------
    app.post("/register",urlencodedParser,user.register);
    app.post("/login",urlencodedParser,user.login);
    app.get("/logout",user.logout);
};

