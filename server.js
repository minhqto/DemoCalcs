//using express to create server

var express = require('express');
var path = require('path');
var HTTP_PORT = process.env.PORT || 8080;

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "src/index.html"));
});

//404 error message
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "/public/img/3bft8u.jpg"));
  });

app.listen(HTTP_PORT, function(){
    console.log(`App listening on ${HTTP_PORT}`);
})