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
    app.get("/dungeonlist/:page",user.dungeonList);
    app.get("/dungeonlist",user.dungeonList);
    app.get("/storieslist",user.storiesList);

//---------------------角色上传页面---------------------
    app.get("/admin/uploadCharacter",user.checkUserState,user.checkUserPermission,user.uploadCharacter);
    app.post("/admin/uploadNewCharacter",user.checkUserState,user.checkUserPermission,urlencodedParser,user.uploadCharacterHandler);

//-------------------角色修改页面------------------------
    app.get('/admin/modifyCharacter/:name',user.checkUserState,user.checkUserPermission,user.modifyCharacter);
    app.post("/admin/modifyExistCharacter",user.checkUserState,user.checkUserPermission,urlencodedParser,user.modifyCharacterHandler);

//-------------------角色页面-----------------------
    app.get("/character/:name",user.character);

//-------------------------地理上传---------------------
    app.get("/admin/uploadGeography",user.checkUserState,user.checkUserPermission,user.uploadGeography);
    app.post("/admin/uploadNewGeography",user.checkUserState,user.checkUserPermission,urlencodedParser,user.uploadGeographyHandler);

//------------------------地理修改-----------------------
    app.get("/admin/modifyGeography/:name",user.checkUserState,user.checkUserPermission,user.modifyGeography);
    app.post("/admin/modifyExistGeography",user.checkUserState,user.checkUserPermission,urlencodedParser,user.modifyGeographyHandler);

//--------------地理页面-------------------
    app.get("/geography/:name",user.geography);

//-------------------------地下城上传---------------------
    app.get("/admin/uploadDungeon",user.checkUserState,user.checkUserPermission,user.uploadDungeon);
    app.post("/admin/uploadNewDungeon",user.checkUserState,user.checkUserPermission,urlencodedParser,user.uploadDungeonHandler);

//------------------------地下城修改-----------------------
    app.get("/admin/modifyDungeon/:name",user.checkUserState,user.checkUserPermission,user.modifyDungeon);
    app.post("/admin/modifyExistDungeon",user.checkUserState,user.checkUserPermission,urlencodedParser,user.modifyDungeonHandler);

//--------------地下城页面-------------------
    app.get("/dungeon/:name",user.dungeon);
//----------------------故事上传---------------------------
    app.get("/admin/uploadStory",user.checkUserState,user.checkUserPermission,user.uploadStory);
    app.post("/admin/uploadNewStory",user.checkUserState,user.checkUserPermission,urlencodedParser,user.uploadStoryHandler);

//----------------------故事修改---------------------------
    app.get("/admin/modifyStory/:name",user.checkUserState,user.checkUserPermission,user.modifyStory);
    app.post("/admin/modifyExistStory",user.checkUserState,user.checkUserPermission,urlencodedParser,user.modifyStoryHandler);

//----------------------故事页面---------------------------
    app.get("/story/:name",user.story);

//----------------首页搜索及列表页分类----------------------
    app.get("/search",user.search);
    app.get("/sortCharacter",user.sortCharacter);

//---------------注册及登录----------------------
    app.get("/checkDuplication",user.checkDuplication);
    app.post("/register",urlencodedParser,user.register);
    app.post("/login",urlencodedParser,user.login);
    app.get("/logout",user.logout);

//---------------管理用户------------------------
//     app.get("/admin/userManage");
};

