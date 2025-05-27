const express = require('express');
const initModels = require('./models/init-models');
const { sequelize } = require('./models');

const app = express();
const models = initModels(sequelize);


const PORT = process.env.PORT || 4001;

app.use(express.static('public'));
app.use(express.json());


app.get("/", async (req, res) =>{
    try {
        const pics = await models.pics.findAll();
        return res.json(pics);
    } catch (error) {
        console.log(error);
        return res.status(500).json({err: "something broke"});
    }
});

app.get("/index", async (req, res) =>{
    try {
        const pics = await models.pics.findAll();
        return res.json(pics);
    } catch (error) {
        console.log(error);
        return res.status(500).json({err: "something broke"});
    }
});

app.get("/images", async (req, res) =>{
    try {
        const pics = await models.pics.findAll();
        return res.json(pics);
    } catch (error) {
        console.log(error);
        return res.status(500).json({err: "something broke"});
    }
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
        return res.status(500).json({err: "something broke"});
    }
});

app.post("/image/:name", async (req, res) =>{
    const {body} = req.body;
    try {
        
    } catch (error) {
        
    }
});


app.get("/registration", async (req, res) =>{
    
});

app.post("/registration", async (req, res) =>{
    
});


app.get("/login", async (req, res) =>{
    
});

app.post("/login", async (req, res) =>{
    
});


app.get("/logout", async (req, res) =>{
    
});

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
  });

app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}.`);
    await sequelize.authenticate();
  });  