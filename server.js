//import dependencies
var express = require("express");
var app = express();
const dotenv = require("dotenv");
const res = require("express/lib/response");
dotenv.config();


//serve static files located in the public folder
app.use("/public", express.static("./public"));


//sets an app.get for the given urlPath to the file at filepath
//if filepath not given it defaults to the name of the url + .html in the pages folder
function mapPath(urlPath, filepath=("/pages/" + urlPath + ".html")){
    app.get(urlPath, function(req, res){
        res.sendFile(__dirname + filepath);
    });
}


//map paths to the respective files to be served
mapPath("/editRoom", "/pages/roomEditor.html");
mapPath("/checkout");
mapPath("/attractions");
mapPath("/", "/index.html");
mapPath("/reserve");
mapPath("/pixi", "/node_modules/pixi.js/dist/browser/pixi.js");
mapPath("/createRoom", "/pages/roomCreator.html");


//listen on the port dictated by the .env file
app.listen(process.env.PORT_NUM, function(){
    console.log("Listening on port: " + process.env.PORT_NUM);
});