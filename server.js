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
app.use(cookieParser());

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
    isseat: true,
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
    isseat: false,
    x: x,
    y: y,
    width: width,
    height: height
  }
}

var theater = [
  createBuildingPiece(10, 10, 280, 20),
  createSeat(10, 50),
  createSeat(50, 50),
  createSeat(90, 50)
];

var diningRoom1 = [
  createSeat(10, 50),
  createSeat(10, 90, true),
  createSeat(10, 130),
  createBuildingPiece(60, 20, 20, 180),
  createSeat(100, 50),
  createSeat(100, 90),
  createSeat(100, 130),
  createSeat(160, 200),
  createSeat(160, 240),
  createSeat(160, 280),
  createBuildingPiece(210, 170, 20, 180),
  createSeat(250, 200),
  createSeat(250, 240),
  createSeat(250, 280)
]

var diningRoom2 =  [
  createSeat(10, 50),
  createSeat(10, 90),
  createSeat(10, 130),
  createBuildingPiece(60, 20, 20, 180),
  createSeat(100, 50),
  createSeat(100, 90),
  createSeat(100, 130),
];

var vipRoom = [
  createSeat(10, 50),
  createSeat(50, 50),
  createSeat(90, 50),
  createSeat(10, 200),
  createSeat(50, 200),
  createSeat(90, 200)
];



/*
querier.getRoomID("Theater", function(id){
  querier.editObjectsInRoom(id, data, function(){
    console.log("dining4");
  });
});*/

/*
querier.clearFurniture(function(){
  console.log("cleared");
  querier.getRoomID("Theater", function(id){
    querier.editObjectsInRoom(id, theater, function(){
      console.log("dining4");
    });
  });
  querier.getRoomID("VIP Room", function(id){
    querier.editObjectsInRoom(id, vipRoom, function(){
      console.log("diningVIP");
    });
  });
  querier.getRoomID("Dining Room 2", function(id){
    querier.editObjectsInRoom(id, diningRoom2, function(){
      console.log("dining2");
    });
  });
  querier.getRoomID("Dining Room 1", function(id){
    querier.editObjectsInRoom(id, diningRoom1, function(){
      console.log("dining1");
    });
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
mapPath("/itinerary");
mapPath("/createEvent", "/pages/eventCreator.html");
mapPath("/admin", "/pages/admin.html");

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


app.get("/getRoomData", function(req,res){
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
      //console.log("40,000 years of human evolution, and we've barely even tapped the vastness of human potential");
      //console.log(out);
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

app.get("/getRoomData", function(req,res){
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
      //console.log("40,000 years of human evolution, and we've barely even tapped the vastness of human potential");
      //console.log(out);
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


//handle request from users to get room data
app.get("/getRoomData/:date/:time", function(req, res){

  //parse the date and time
  var raw_date = req.params.date;
  var raw_time = req.params.time;
  var dtObject = {
    "time": raw_date + " " + (12 + parseInt(raw_time)),
    "format": "YYYY-MM-DD HH24"
  };

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
          var toSendBack = [];
          querier.getUnavailableSeats(id, dtObject, function(rows){
            //console.log("*************Godspeed**************");
            //console.log(rows);
            for (row of rows){
              var newOne = row;
              newOne.available = false;
              toSendBack.push(newOne);
            }
            querier.getAvailableSeats(id, dtObject, function(more_rows){
              //console.log("DO YOU KNOW HOW MUCH I SACRIFICED!");
              //console.log(more_rows);
              //console.log(rows);
              if (toSendBack.length < 0){
                reject(more_rows);
              }
              else{
                for (r of more_rows){
                  more_rows["available"] = true;
                  toSendBack.push(r);
                }
                resolve(toSendBack);
              }
            });

          });
        });
      });
      promises.push(p);
    }
    Promise.all(promises).then((out) => {
      //console.log("40,000 years of human evolution, and we've barely even tapped the vastness of human potential");
      //console.log(out);
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

app.post("/reserveEvent", function(req, res){
  var name = req.cookies.id;
  if (name != undefined){
    var reservations = [];
    var tickets = req.body.tickets;
    var event = req.body.eventID;
    var dtObject = {
      "time": req.body.date + " " + (12 + parseInt(req.body.time)),
      "format": "YYYY-MM-DD HH24"
    };
    for (var u = 0; u < tickets; u++){
      reservations.push({
        eventID: event,
        userID: name,
        date: dtObject.time,
        formatting: dtObject.format,
        seat: 'false'
      })
    }
  }
  else{
    res.json({"code": 404});
  }
});

app.post("/createNewEvent", function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    if (err){
      console.log(err);
    }
    var oldpath = files.image.filepath;
    var newpath = "./public/images/" + files.image.originalFilename;
    var fs = require("fs");
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
    querier.createEvent(fields.name, fields.description, newpath, fields.capacity, function(x){
      res.html("<p>Event created successfully.</p><p><a href='/'>Back to admin hub</a>");
      res.end();
    });
  });
});

app.post("/reserveSeats", function(req, res){
  var reservations = [];
  var name = req.cookies.id;
  console.log("NAME", name);
  if (name != undefined){
    var dtObject = {
      "time": req.body.date + " " + (12 + parseInt(req.body.time)),
      "format": "YYYY-MM-DD HH24"
    };
    for (pk of req.body.seats){
      reservations.push({
        seatID: pk,
        userID: name,
        date: dtObject.time,
        formatting: dtObject.format,
        seat: 'true'
      });
    }
    console.log(reservations);
    querier.addReservations(reservations, function(){
      console.log("Let's go!!!");
      res.json({"code": 200});
    });
  }
  else{
    console.log("FAILED");
    res.json({"code": 404});
  }
  
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
  querier.getReservations(req.cookies.id, (results) => {
    // Constructs a very ugly dictionary with the results
    var dict = {};
    console.log(results);
    for(result of results) {
      console.log("isSeat: " + result.isSeat);
      console.log("isseat: " + result.isseat);
      // Checks if timestamp is in dict
      if(result.timestamp in dict) {
        // Checks if 
        let isseat = result.isseat;
        if(isseat in dict[result.timestamp]) {
          if(!result.isseat) {
            dict[result.timestamp][isseat].tickets++;
          } else {
            dict[result.timestamp][isseat].tickets++;
          }
        } else {
          if(!isseat) {
            dict[result.timestamp][isseat] = {
              event: result.event,
              tickets: 1
            }
          } else {
            dict[result.timestamp][isseat] = {
              tickets: 1
            }
          }
        }
      } else {
        dict[result.timestamp] = {}
        if(!result.isseat) {
          dict[result.timestamp][result.isseat] = {
            event: result.event,
            tickets: 1
          }
        } else {
          dict[result.timestamp][result.isseat] = {
            tickets: 1
          }
        }
      }
    }
    res.json(dict);
  });
}); // getReservations

// Deletes reservations of user at a certain timestamp
app.post("/deleteReservations", (req, res) => {
  const date = req.body.date;
  const hour = req.body.hour;
  const timestamp = date + " " + hour;
  console.log("TIMESTAMP: " + timestamp);
  const formatting = "YYYY-MM-DD HH24";
  const event = req.body.event;
  const isseat = req.body.isseat;
  const id = req.cookies.id;
  if(isseat) {
    querier.deleteSeatReservations({
      userID: id,
      isseat: isseat,
      timestamp: timestamp,
      formatting: formatting
    });
  } else {
    querier.deleteEventReservation({
      userID: id,
      isseat: isseat,
      event: event,
      timestamp: timestamp,
      formatting: formatting
    });
  }
  
});

//listen on the port dictated by the .env file
app.listen(process.env.PORT_NUM, function(){
    console.log("Listening on port: " + process.env.PORT_NUM);
});