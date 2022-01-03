var express = require("express");
var app = express();
const dotenv = require("dotenv");
dotenv.config();

app.use("/public", express.static("./public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/attractions", function(req, res){
    res.sendFile(__dirname + "/attractions.html");
});

app.get("/checkout", function(req, res){
    res.sendFile(__dirname + "/checkout.html");
});

app.get("/reserve", function(req, res){
    res.sendFile(__dirname + "/reserve.html");
});

app.listen(process.env.PORT_NUM, function(){
    console.log("Listening on port: " + process.env.PORT_NUM);
});