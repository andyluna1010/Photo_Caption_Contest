const express = require('express');

const app = express();


const PORT = process.env.PORT || 4001;

app.use(express.static('public'));


app.get("/", (req, res) =>{
    res.send("test");
});

app.get("/index", (req, res) =>{
    
});

app.get("/images", (req, res) =>{
    
});


app.get("/image/:name", (req, res) =>{
    
});

app.post("/image/:name", (req, res) =>{
    
});


app.get("/registration", (req, res) =>{
    
});

app.post("/registration", (req, res) =>{
    
});


app.get("/login", (req, res) =>{
    
});

app.post("/login", (req, res) =>{
    
});


app.get("/logout", (req, res) =>{
    
});

app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
  });

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
  });  