const express = require('express');
const initModels = require('./models/init-models');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { sequelize } = require('./models');
const NodeCache = require( "node-cache" );

const myCache = new NodeCache();
const app = express();
const models = initModels(sequelize);


const PORT = process.env.PORT || 4001;
const SECRET = "coffeeCakes"

app.use(express.static('public'));
app.use(express.json());

async function imageGet(req, res){

    if (myCache.has("images")) {
        console.log("cached images");
        res.json(myCache.get("images"));
    } else {
        try {
            const pics = await models.pics.findAll();
            const captionPics = await models.captions.findAll();

            const captionArray = [];
            for  (var i=0; i < captionPics.length; i++){
                const picsInfo = await models.pics.findOne({where: captionPics[i].pics_id});
                const userInfo = await models.users.findOne({where: captionPics[i].user_id});
                const captionInfo = {
                    pics_id: picsInfo.id,
                    pics_name: picsInfo.name,
                    username: userInfo.username,
                    caption: captionPics[i].caption,
                    createdAt: captionPics[i].createdAt,
                    pics_data: picsInfo.image,
                }
                captionArray.push(captionInfo);
            }

            const jsonArray = [pics, captionArray]
            myCache.set("images", jsonArray);

            console.log("not cached");

            res.json(jsonArray);
        } catch (error) {
            console.log(error);
            res.status(500).json({err: "something broke"});
        }  
    }
}

async function authorizationMiddleware(req, res, next){
    try {
        const token = req.headers['authorization'].split(" ")[1];
        const decoded = jwt.verify(token, SECRET);
        console.log(decoded);
        if(decoded){
            const userCheck = await models.users.findOne({
                where: {username: decoded.username},
            });
            if(userCheck){
                const passwordValid = await bcrypt.compare(decoded.password, userCheck.password);
                if(passwordValid){
                    next();
                }else{
                    return res.status(400).json({ err : "Password Incorrect" });
                }
            }else{
                return res.status(404).json({ err : "User does not exist" });
            }
        }
    } catch (error) {
       return res.status(401).json({"msg":"Could not Authenticate"});
    }
}

app.get("/", async (req, res) =>{
    imageGet(req, res)
});

app.get("/index", async (req, res) =>{
    imageGet(req, res)
});

app.get("/images", async (req, res) =>{
    imageGet(req, res)
});

app.get("/image/:name", async (req, res) =>{
    const name = req.params.name;
    try {
        const pics = await models.pics.findOne({
            where: {name},
        });
        return res.json(pics);
    } catch (error) {
        console.log(error);
        return res.status(404).json({err: "image not found"});
    }
});

app.post("/image/:name",
authorizationMiddleware,
async (req, res, next)=>{
        try {
            const userCheck = await models.users.findOne({
                where: {username: req.body.username},
            });
            const picsID = await models.pics.findOne({
                where: {name: req.params.name},
            });
            if(!userCheck){
                return res.status(404).json({'msg':"User not found"});
            }if (!picsID) {
               return res.status(404).json({'msg':"Image not found"}); 
            }else{
                var newCaption = {
                    pics_id : picsID.id,
                    user_id : userCheck.id,
                    caption : req.body.caption,
                }

                createCaption = await models.captions.create(newCaption);
                return res.status(201).json(newCaption);
            }            
        } catch (error) {
            return res.status(500).json({err: "something broke "+ error});
        }

});


app.get("/registration", async (req, res) =>{
     res.json({username: "___", password: "___"});
});

app.post("/registration", async (req, res) =>{
    try {
        const userCheck = await models.users.findOne({
            where: {username: req.body.username},
        });

        if (userCheck) {
            return res.json({message: "Username taken"});
        } else {
            const salt = await bcrypt.genSalt(9);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
     
            var newUser = {
                username: req.body.username,
                password: hashPassword
            };
    
            createUser = await models.users.create(newUser);
            
            return res.status(201).json(createUser);  
        }
    } catch (error) {
        return res.status(500).json({err: "something broke"});
    }
});


app.get("/login", async (req, res) =>{
    res.json({username: "___", password: "___"});
});

app.post("/login", async (req, res) =>{
    try {
        const userCheck = await models.users.findOne({
            where: {username: req.body.username},
        });

        if(userCheck){
            const passwordValid = await bcrypt.compare(req.body.password, userCheck.password);
            if(passwordValid){
                token = jwt.sign({id: userCheck.id, username: userCheck.username}, SECRET);
               return res.status(200).json({token: token});
            }
            else{
               return res.status(400).json({ err : "Password Incorrect" });
            }
        }else{
            return res.status(404).json({ err : "User does not exist" });
        }
    } catch (error) {
        return res.status(500).json({err: "something broke"});
    }
});

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
  });

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}.`);
    await sequelize.authenticate();
  });  