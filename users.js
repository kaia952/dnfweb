var sql;
var connection = require('./mysqlConfig');
connection.connect();
var bcrypt = require('bcrypt');
const saltRound = 10;
//--------------------------------------------------四个列表页面------------------------------------------
exports.Index= function (req,res) {
    res.render("index",{
        user:req.session.user
    });
};

exports.characterList=function (req,res) {
    if(!req.params.page){
        res.redirect("/characterlist/1");
        return;
    }
    var page=req.params.page;
    var totalPages;
    var characterPerPage=6;

    sql = "SELECT name FROM dnfcharacter";
    connection.query(sql,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        totalPages = Math.ceil(result.length/characterPerPage);
    });
    sql = "SELECT * FROM dnfcharacter LIMIT "+characterPerPage+" OFFSET "+ (page-1)*characterPerPage;
    connection.query(sql,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("-------加载人物列表-------");
        res.render("characterlist",{
            page:page,
            totalPages:totalPages,
            user:req.session.user,
            result:result
        })
    });
};

exports.geographyList = function (req,res) {
    sql = "SELECT * FROM dnfgeography";
    connection.query(sql,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("-------加载地理列表-------");
        res.render("geographylist",{
            user:req.session.user,
            result:result
        })
    })
};

exports.dungeonList=function (req,res) {
    sql = "SELECT * FROM dnfdungeon";
    connection.query(sql,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("-------加载地理列表-------");
        res.render("dungeonlist",{
            user:req.session.user,
            result:result
        })
    })
};

exports.eventsList=function (req,res) {
    res.send("这是eventslist");
};

//----------------------------------------------------人物相关------------------------------------------------
exports.uploadCharacter = function (req,res) {
    res.sendFile(__dirname+"/uploadCharacter.html");
};

exports.uploadCharacterHandler = function (req,res) {
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
};

exports.modifyCharacter = function (req,res) {
    var modifyName = req.params.name;
    sql= "SELECT * FROM dnfCharacter WHERE name=?";
    connection.query(sql,modifyName,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("查找到人物，进入修改："+modifyName);
        res.render("characterModify",{
            user:req.session.user,
            result:result
        })
    });
};

exports.modifyCharacterHandler = function (req,res) {
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
};

exports.character = function (req,res) {
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
            user:req.session.user,
            result:result
        })
    });
};
//----------------------------------------------------地理相关------------------------------------------------
exports.uploadGeography = function (req,res) {
    res.sendFile(__dirname+"/uploadGeography.html");
};

exports.uploadGeographyHandler =function (req,res) {
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
};

exports.modifyGeography = function (req,res) {
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
};

exports.modifyGeographyHandler = function (req,res) {
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
        console.log("-----------MODIFY SUCCESS---------");
        console.log(result);
        console.log("----------------------------------");
    });
    res.redirect("/admin/uploadGeography");
};

exports.geography = function (req,res) {
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
};

exports.search = function (req,res) {
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
};

//----------------------------------------------------地下城相关------------------------------------------------
exports.uploadDungeon=function (req,res) {
    res.sendFile(__dirname+"/uploadDungeon.html");
};

exports.uploadDungeonHandler = function (req,res) {
    var Dname = req.body.dungeonName;
    var Dimg = req.body.dungeonImg;
    var Dposition = req.body.dungeonPosition;
    var Dboss = req.body.dungeonBoss;
    var Dintro =req.body.dungeonIntro;
    sql = "INSERT INTO dnfdungeon(name,imgsrc,position,boss,intro) VALUES(?,?,?,?,?)";
    var addPara=[Dname,Dimg,Dposition,Dboss,Dintro];
    connection.query(sql,addPara,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("------------地下城上传成功-----------");
        console.log(result);
        console.log("-------------------------------------");
    });
    res.redirect("/admin/uploadDungeon");
};

exports.modifyDungeon=function (req,res) {
    var modifyName = req.params.name;
    sql="SELECT * FROM dnfdungeon WHERE name=?";
    connection.query(sql,modifyName,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("查找到地下城，进入修改："+modifyName);
        res.render("geographyModify",{
            result:result
        })
    })
};

exports.modifyDungeonHandler = function (req,res) {
    var DID = req.body.dungeonID;
    var Dname = req.body.dungeonName;
    var Dimg = req.body.dungeonImg;
    var Dposition = req.body.dungeonPosition;
    var Dboss = req.body.dungeonBoss;
    var Dintro =req.body.dungeonIntro;
    sql="UPDATE dnfdungeon SET name=?,position=?,imgsrc=?,boss=?,intro=? WHERE id=?";
    var modifyPara=[Dname,Dposition,Dimg,Dboss,Dintro,DID];
    connection.query(sql,modifyPara,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("--------------MODIFY SUCCESS------------");
    });
    res.redirect("/admin/uploadDungeon");
};

exports.dungeon = function (req,res) {
    var searchName=req.params.name;
    sql = "SELECT * FROM dnfdungeon WHERE name='"+ searchName+"'";
    connection.query(sql,function (err,result) {
        if(err){
            console.log("ERROR:"+err.message);
            return;
        }
        console.log("查找到地下城："+searchName);
        res.render("dungeon",{
            result:result
        })
    })
};
//-------------------------------------分类-----------------------------
exports.sortCharacter = function (req,res) {
    var range="";
    var arr2=[];
    //存在searchall则判断为没有选中任何分类标签，全部显示
    if(req.query.searchall){
        sql="SELECT name,species,gender,imgsrc,faction,position,summary FROM dnfcharacter LIMIT 6";
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
};

//--------------登陆及注册----------------
exports.register = function (req,res) {
    var Uname = req.body.registerUsername;
    var Upassword = req.body.registerPassword;
    var UconfirmPassword = req.body.confirmPassword;
    var existed=false;
    sql="SELECT username FROM users WHERE username=?";
    connection.query(sql,Uname,function (err,result) {
        if(err){
            console.log(err.message);
        }
        // console.log(result);
        if(result!=""){
            console.log("下面设置existed为true");
            existed = true;
        }
    });

    if(Upassword !== UconfirmPassword){
        res.send("密码不一致，请返回重新输入！");
        return;
    }
    bcrypt.genSalt(saltRound,function (err,salt) {
        if(err){
            console.log("genSalt Error:"+err.message);
            return;
        }
        console.log(Upassword);
        bcrypt.hash(Upassword,salt,function (err,hash) {
            if(err){
                console.log("hash Error:"+err.message);
                return;
            }
            console.log(hash);
            Upassword = hash;

            console.log(Upassword);
            sql="INSERT INTO users(username,password) VALUES(?,?)";
            var addPara = [Uname,Upassword];
            connection.query(sql,addPara,function (err,result) {
                if (err){
                    console.log("ERROR:"+err.message);
                    return;
                }
                console.log("------REGISTER SUCCESS----");
            });

        })
    });
    res.redirect("/");
};

exports.login = function (req,res) {
    var Uname = req.body.loginUsername;
    var Upassword = req.body.loginPassword;
    sql = "SELECT * FROM users WHERE username=?";
    connection.query(sql,Uname,function (err,result) {
        if(err){
            console.log("genSalt Error:"+err.message);
            return;
        }
        if(result.length==0){
            console.log("error");
            res.redirect("/");
        }
        else{
            bcrypt.compare(Upassword,result[0].password,function (err,isMatch) {
                console.log("比较完成");
                console.log(isMatch);
                if(err){
                    console.log(err.message);
                    return;
                }
                if(isMatch){
                    console.log("登录成功");
                    req.session.user = {
                        username:Uname,
                        password:result[0].password
                    };
                    res.redirect("/");
                }
                else{
                    console.log("用户不存在或者密码不正确");
                    res.redirect("/");
                }
            })
        }
    })
    
};

exports.logout =function (req,res) {
    delete req.session.user;
    res.redirect('/');
};

