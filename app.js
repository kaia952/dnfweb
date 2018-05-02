var express = require('express');
var app = new express();
var mysql = require('mysql');
var bodyparser = require('body-parser');

var urlencodedParser = bodyparser.urlencoded({extended:true});
var sql;
var id;

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'dnf',
    port:'3306'
});

connection.connect();

app.set('view engine','jade');
app.set('views','./views/pages');
app.use('/public',express.static(__dirname+"/public"));

//----------------------首页---------------------
app.get("/",function (req,res) {
    res.sendFile(__dirname+"/index.html");
});

//---------------------角色页、地理页、地下城页、事件页--------------------
app.get("/characterlist",function (req,res) {
    sql = "SELECT * FROM dnfcharacter";
    connection.query(sql,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("-------加载人物列表-------");
        res.render("characterlist",{
            result:result
        })
    });
});

app.get("/geographylist",function (req,res) {
    sql = "SELECT * FROM dnfgeography";
    connection.query(sql,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("-------加载地理列表-------");
        res.render("geographylist",{
            result:result
        })
    })
});
app.get("/dungeonlist",function (req,res) {
    res.send("这是dungeonlist");
});
app.get("/eventslist",function (req,res) {
    res.send("这是eventslist");
});

//---------------------角色上传页面---------------------
app.get("/admin/uploadCharacter",function (req,res) {
    res.sendFile(__dirname+"/uploadCharacter.html");
});

app.post("/admin/uploadNewCharacter",urlencodedParser,function (req,res) {
    var Cname = req.body.characterName;
    var Cspecies = req.body.characterSpecies;
    var Cgender = req.body.characterGender;
    var Cimg = req.body.characterImg;
    var CimgFavorM = req.body.characterImgFavorM;
    var CimgFavorH = req.body.characterImgFavorH;
    var Cfaction = req.body.characterFaction;
    var Cposition = req.body.characterPosition;
    var Csummary = req.body.characterSummary;
    var Cintro = req.body.characterIntro;
    var Cdialog = req.body.characterDialog;
    var date = new Date();
    var uploadDate = date.toLocaleDateString()+" "+date.toLocaleTimeString();
    var modifyDate = date.toLocaleDateString()+" "+date.toLocaleTimeString();
    sql="INSERT INTO dnfCharacter(name,species,gender,imgsrc,imgFavorM,imgFavorH,faction,position,summary,intro,dialog,uploadDate,modifyDate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);";
    var addPara=[Cname,Cspecies,Cgender,Cimg,CimgFavorM,CimgFavorH,Cfaction,Cposition,Csummary,Cintro,Cdialog,uploadDate,modifyDate];
    connection.query(sql,addPara,function (err,result) {
        if(err){
            console.log("INSERT ERROR:"+err.message);
            return;
        }
        console.log("-----------INSERT SUCCESS---------");
        console.log(result);
        console.log("----------------------------------");
    });
    res.redirect("/admin/uploadCharacter");
});

//-------------------角色修改页面------------------------
app.get('/admin/modifyCharacter/:name',function (req,res) {
    var modifyName = req.params.name;
    sql= "SELECT * FROM dnfCharacter WHERE name=?";
    connection.query(sql,modifyName,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("查找到人物，进入修改："+modifyName);
        res.render("characterModify",{
            result:result
        })
    });
});
app.post("/admin/modifyExistCharacter",urlencodedParser,function (req,res) {
    var CID = req.body.characterID;
    var Cname = req.body.characterName;
    var Cspecies = req.body.characterSpecies;
    var Cgender = req.body.characterGender;
    var Cimg = req.body.characterImg;
    var CimgFavorM = req.body.characterImgFavorM;
    var CimgFavorH = req.body.characterImgFavorH;
    var Cfaction = req.body.characterFaction;
    var Cposition = req.body.characterPosition;
    var Csummary = req.body.characterSummary;
    var Cintro = req.body.characterIntro;
    var Cdialog = req.body.characterDialog;
    var date = new Date();
    var modifyDate = date.toLocaleDateString()+" "+date.toLocaleTimeString();
    sql = "UPDATE dnfCharacter SET name=?,species=?,gender=?,imgsrc=?,imgFavorM=?,imgFavorH=?,faction=?,position=?,summary=?,intro=?,dialog=?,modifyDate=? WHERE id=?";
    var modifyPara=[Cname,Cspecies,Cgender,Cimg,CimgFavorM,CimgFavorH,Cfaction,Cposition,Csummary,Cintro,Cdialog,modifyDate,CID];
    connection.query(sql,modifyPara,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("--------------MODIFY SUCCESS------------");
    });
    res.redirect("/admin/uploadCharacter");
});
//-------------------角色页面-----------------------
app.get("/character/:name",function (req,res) {
    var searchName = req.params.name;
    sql = "SELECT * FROM dnfCharacter WHERE name=?";
    connection.query(sql,searchName,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("查找到人物："+searchName);

        //-----将角色的对话根据段落拆分---------
        if(result[0].dialog && result[0].dialog!==""){
            var findDialog = result[0].dialog.split("\r\n");
            var filteredDialog = [];
            for(var i=0;i<findDialog.length;i++){
                if(findDialog[i]!=""){                //将非空元素传入新数组
                    filteredDialog.push(findDialog[i]);
                }
            }

            // console.log(filteredDialog.length);
            result[0].dialog = filteredDialog;
        }
        //-------------------------------------
        res.render("character",{
            result:result
        })
    });
});
//-------------------------地理上传---------------------
app.get("/admin/uploadGeography",function (req,res) {
    res.sendFile(__dirname+"/uploadGeography.html");
});
app.post("/admin/uploadNewGeography",urlencodedParser,function (req,res) {
    var Gname = req.body.geographyName;
    var Gtype = req.body.geographyType;
    var Gimg = req.body.geographyImg;
    var Gintro = req.body.geographyIntro;
    sql="INSERT INTO dnfgeography(name,type,imgsrc,intro) VALUES(?,?,?,?);";
    var addPara = [Gname,Gtype,Gimg,Gintro];
    connection.query(sql,addPara,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("-----------INSERT SUCCESS---------");
        console.log(result);
        console.log("----------------------------------");
    });
    res.redirect("/admin/uploadGeography");
});
//------------------------地理修改-----------------------
app.get("/admin/modifyGeography/:name",function (req,res) {
    var modifyName = req.params.name;
    sql="SELECT * FROM dnfgeography WHERE name=?";
    connection.query(sql,modifyName,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("查找到地理，进入修改："+modifyName);
        res.render("geographyModify",{
            result:result
        })
    })
});
app.post("/admin/modifyExistGeography",urlencodedParser,function (req,res) {
    var GID = req.body.geographyID;
    var Gname = req.body.geographyName;
    var Gtype = req.body.geographyType;
    var Gimg = req.body.geographyImg;
    var Gintro = req.body.geographyIntro;
    sql="UPDATE dnfgeography SET name=?,type=?,imgsrc=?,intro=? WHERE id=?";
    var modifyPara = [Gname,Gtype,Gimg,Gintro,GID];
    connection.query(sql,modifyPara,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("-----------INSERT SUCCESS---------");
        console.log(result);
        console.log("----------------------------------");
    });
    res.redirect("/admin/uploadGeography");
});
//--------------地理页面-------------------
app.get("/geography/:name",function (req,res) {
    var searchName = req.params.name;
    sql = "SELECT * FROM dnfgeography WHERE name=?";
    connection.query(sql,searchName,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("查找到地理："+searchName);
        res.render("geography",{
            result:result
        })
    });
});
//----------------搜索页面----------------------
app.get("/search",function (req,res) {
    var searchType1 = req.query.searchType1;
    var searchInfo = req.query.searchInfo;
    searchInfo = "%"+searchInfo+"%";
    var searchType2="name";
    var searchTablet;
    var renderPage;
    switch (searchType1){
        case "character":
            searchTablet = "dnfCharacter";
            searchType2 = req.query.searchTypeCharacter;
            renderPage = "characterlist";
            break;
        case "geography":
            searchTablet = "dnfGeography";
            renderPage = "geographylist";
            break;
        case "dungeon":
            searchTablet = "dnfDungeon";
            break;
        case "events":
            searchTablet = "dnfEvents";
            break;
    }
    sql = "SELECT * FROM "+searchTablet+" WHERE "+searchType2+" LIKE ?";

    var searchPara = [searchInfo];
    connection.query(sql,searchPara,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("------------输出查找结果-----------");
        res.render(renderPage,{
            result:result
        })
    })
});

app.get("/sortCharacter",function (req,res) {
    var range="";
    var arr2=[];
    //存在searchall则判断为没有选中任何分类标签，全部显示
    if(req.query.searchall){
        sql="SELECT name,species,gender,imgsrc,faction,position,summary FROM dnfcharacter";
        connection.query(sql,function (err,result) {
            if(err){
                console.log("ERROR:"+err.message);
                return;
            }
            res.json(result);
        });
    }
    //遍历get请求里的对象
   else{
        for(var key in req.query){
            var partsql="";
            if(req.query.hasOwnProperty(key)){
                //若为数组（即出现了多选），则在mysql语句添加OR；若不为数组（即只有单选，此时为字符串），则不添加OR
                if(req.query[key] instanceof Array){
                    for(var i=0;i<req.query[key].length;i++){
                        if(i>0){
                            partsql = partsql +" OR "+key+"="+"'"+req.query[key][i]+"'";
                        }
                        else{
                            partsql = partsql +key+"="+"'"+req.query[key][i]+"'";
                        }
                    }
                }
                else{
                    partsql = partsql+key+"="+"'"+req.query[key]+"'";
                }
            }
            //将查询每一个key对应的mysql语句推入到一个数组之内
            arr2.push(partsql);
        }
        //拼接mysql语句
        for(var j=0;j<arr2.length;j++){
            if(j===0){
                range = range+"("+arr2[j]+")";
            }
            else{
                range = range+" AND "+"("+arr2[j]+")";
            }
        }

        sql = "SELECT name,species,gender,imgsrc,faction,position,summary FROM dnfcharacter WHERE "+range;
        connection.query(sql,function (err,result) {
            if(err){
                console.log("ERROR:"+err.message);
                return;
            }
            res.json(result);
        });
    }

});

//---------------------测试-------------------
app.get("/charactertest",function (req,res) {
    res.sendFile(__dirname+"/characterTest.html");
});

app.listen(8081,function () {
    console.log("--------------dnf web启动中-----------");
});