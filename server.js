//import express to create server
var express = require("express");
var app = express();

//library for easy environment variable access
const dotenv = require("dotenv");
dotenv.config();

//library for easy form reading
var formidable = require("formidable");

//dependencies for google sign in
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("");

//serve static files located in the public folder
app.use("/public", express.static("./public"));

//cookie parser middleware
var cookieParser = require("cookie-parser");

//SAMPLE CODE FROM NODE POSTGRES THING
const { Client } = require('pg');
const queries = require("./queries");
const client2 = new Client()
client2.connect();
var querier = new queries(client2);
var data = [
  {
    id: 0,
    new: true,
    seat: true,
    x: 100,
    y: 100,
    width: 20,
    height: 20
  },
  {
    id: 1,
    new: true,
    seat: false,
    x: 150,
    y: 100,
    width: 100,
    height: 40
  },
]


/*
querier.getRoomID("TEST", function(id){
  querier.deleteRoom(id, function(){
    console.log("DONE");
  });
});*/

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
mapPath("/login");


//function to create a session key for a user who signed in successfully
function createSessionKey(){
  var key = "";
  for (var i = 0; i < 10; i++){
    key += Math.floor(Math.random() * 10) + "";
  }
  return key;
}

//handle a regular, non-Google log in attempt
app.post("/login-normal", function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        //handle potential form processing error
        if (err){
            console.log(err);
            res.send("ERROR WITH LOGIN");
            res.end();
        }

        //handle username and password validation here
        var uname = fields.username;
        var pwd = fields.password;
        console.log("USERNAME", uname);
        console.log("PASSWORD", pwd);

        //create a session key if successful, then send them back

        res.redirect("/");
    });
});

app.get("/gsignin/:token", function(req, res){
  var gtoken = req.params.token;

  //handle forms in these thingies
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: gtoken,
        audience: "",  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    var givenEmail = payload.email;
    var valid = false;
    //check if email exists yet


    if (valid){
      var sessionkey = createSessionKey();
      //USE SESSION KEY IN THE DB SOMEWHERE
      

      //create cookies for email and key
      res.cookie("email", givenEmail);
      res.cookie("key", sessionkey);
      res.redirect("/");
    }
    else{
      //sign them up here
      res.redirect("/");
    }

    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  verify().catch(console.error);
});


//handle request to get room data
app.get("/getRoomData", function(req, res){

  querier.getRooms(function(rows){
    var names = [];
    for (row of rows){
      names.push(row.name);
    }
    var promises = [];
    for (n of names){
      var p = new Promise((resolve, reject) => {
        querier.getRoomID(n, function(id){
          querier.editObjectsInRoom(id, data, function(res){
            querier.getObjectsInRoom(id, function(rows){
              if (rows.length == 0){
                reject(rows);
              }
              else{
                resolve(rows);
              }
            });
          });
        });
      });
      promises.push(p);
    }
    Promise.all(promises).then((out) => {
      var final_res = [];
      for (var i = 0; i < names.length; i++){
        final_res.push({
          [names[i]]: out[i]
        });
      }
      res.json(final_res);
    })
  });
  
});


//listen on the port dictated by the .env file
app.listen(process.env.PORT_NUM, function(){
    console.log("Listening on port: " + process.env.PORT_NUM);
});