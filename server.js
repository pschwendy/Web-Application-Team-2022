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
const client = new OAuth2Client("409957581376-mj4a4cpr59lng5tojabia8ust2fblo47.apps.googleusercontent.com");

//serve static files located in the public folder
app.use("/public", express.static("./public"));

app.use(express.json());
app.use(express.urlencoded());

//cookie parser middleware
var cookieParser = require("cookie-parser");

//SAMPLE CODE FROM NODE POSTGRES THING
const { Client } = require('pg');
const queries = require("./queries");
const client2 = new Client()
client2.connect();
var querier = new queries(client2);


function createSeat(x, y, available=true){
  return {
    pk: 0,
    new: true,
    seat: true,
    x: x,
    y: y,
    width: 20,
    height: 20,
    available: available
  }
}

function createBuildingPiece(x, y, width, height){
  return {
    pk: 0,
    new: true,
    seat: false,
    x: x,
    y: y,
    width: width,
    height: height
  }
}

var data = [
  createSeat(10, 50),
    createSeat(50, 50),
    createSeat(90, 50),
    createSeat(10, 200),
    createSeat(50, 200),
    createSeat(90, 200)
]

/*
querier.getRoomID("VIP Room", function(id){
  querier.editObjectsInRoom(id, data, function(){
    console.log("dining3");
  });
});
*/
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

app.get('/logout', (req, res) => {
  console.log("HERE");
  res.clearCookie("email", { path: '/' });
  res.clearCookie("name", { path: '/' });
  res.clearCookie("id", { path: '/' });
  res.clearCookie("key", { path: '/' });
  res.redirect('/');
})
// Handle a regular, non-Google log in attempt
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
}); // login-normal

// Verifies google signin and sets cookies
app.get("/gsignin/:token", function(req, res){
  var gtoken = req.params.token;

  //handle forms in these thingies
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: gtoken,
        audience: "409957581376-mj4a4cpr59lng5tojabia8ust2fblo47.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    var givenEmail = payload.email;
    var givenName = payload.name;
    var sessionkey = createSessionKey();
    //USE SESSION KEY IN THE DB SOMEWHERE
    
    await querier.googleSignIn(givenEmail, givenName)
    .then((id) => {
      if(id == -1) {
        res.json(false);
      } else {
        res.cookie("email", givenEmail);
        res.cookie("name", givenName);
        res.cookie("id", id);
        res.cookie("key", sessionkey);
        res.redirect("/");
      }  
    }).catch(e => {
      console.log(e);
    });
    //create cookies for email and key

    // If request specified a G Suite domain:
    // const domain = payload['hd'];
  }
  verify().catch(console.error);
}); // gsignin


//handle request to get room data
app.get("/getRoomData", function(req, res){
  //console.log("Get some room data")
  querier.getRooms(function(rows){
    var names = [];
    for (row of rows){
      names.push(row.name);
    }
    //console.log(names);
    var promises = [];
    for (n of names){
      var p = new Promise((resolve, reject) => {
        querier.getRoomID(n, function(id){
          querier.getSeats(id, function(rows){
            //console.log(rows);
            if (rows.length < 0){
              reject(rows);
            }
            else{
              resolve(rows);
            }
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
      //console.log("CHECK THIS: " +  final_res);
      res.json(final_res);
    }).catch((reject) => {
      //console.log("oOps");
      console.log(reject);
    });
  });
  
});

// Submits new room data to database
app.post("/editRoomData", function(req, res){
  querier.editObjectsInRoom(req.body.roomid, req.body.updates, function(y){
    console.log(y);
    var ids = [];
    for (deletion of req.body.deletions){
      ids.push(deletion.pk);
    }
    querier.deleteObjects(ids, function(x){
      console.log("DID IT!!!!");
      console.log(x);
      res.redirect('/');
    });
    
  });
}); // editRoomData

// Gets itinerary of user
app.get("/getReservations", (req, res) => {
  querier.getReservations(req.cookies['pk'], (results) => {
    var dict = {};
    for(result of results) {
      if(result.timestamp in dict) {
        dict[result.timestamp]++;
      } else {
        dict[result.timestamp] = 1;
      }
    }
    res.json(dict);
  });
}); // getReservations

//listen on the port dictated by the .env file
app.listen(process.env.PORT_NUM, function(){
    console.log("Listening on port: " + process.env.PORT_NUM);
});