const { Pool } = require('pg');
const bcrypt = require("bcryptjs");
// await pool.connect()
const env = process.env.NODE_ENV || 'development';

let connectionString = {
    user: 'event',
    password: 'supersecretpassword',
    port: 5432,
};
// checking to know the environment and suitable connection string to use
if (env === 'development') {
    connectionString.database = 'event_db';
} else {
    connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
};

class queries {
    constructor(pg_instance){
        this.client = pg_instance;
    }

    createRoom(name, callback){
        var client = this.client;
        client.query("INSERT INTO rooms(name) VALUES('" + name + "')", (err, res) => {
            if (err){
              console.log(err);
            }
            callback(res);
         })
    }

    //gets all the rooms from the database
    getRooms(callback){
        this.client.query("SELECT * FROM rooms", (err, res) => {
            if (err){
                console.log(err);
            }
            callback(res.rows);
        });
    }

    //gets the id of a room by name
    getRoomID(name, callback){
        this.client.query("SELECT * FROM rooms WHERE name='" + name + "'", (err, res) => {
            if (err){
                console.log(err);
            }
            callback(res.rows[0]['pk']);
        });
    }

    getObjectsInRoom(id, callback){
        this.client.query("SELECT * FROM furniture WHERE roomID=" + id, (err, res) => {
            if (err){
                console.log(err);
            }
            callback(res.rows);
        });
    }

    //edit the objects in a room
    //data is an object with the following structure
    /*
    [
        {
            id: (int),
            new: (bool),
            seat: (bool),
            x: (int),
            y: (int),
            width: (int) (if not seat),
            height: (int) (if not seat),

        },
        ...
    ]
    */
    editObjectsInRoom(id, data, callback){
        var promises = [];
        for (var x = 0; x < data.length; x++){
            var obj = data[x];
            if (obj.seat){
                obj.width = 20;
                obj.height = 20;
            }
            if (obj.new){
                
                let p = new Promise((resolve, reject) => {
                    this.client.query("INSERT INTO furniture(isseat, width, height, x, y, available, roomID) VALUES($1, $2, $3, $4, $5, $6, $7)",
                    [
                        obj.seat,
                        obj.width,
                        obj.height,
                        obj.x,
                        obj.y,
                        true,
                        id
                    ], (err, res) => {
                        if (err){
                            reject(err);
                        }
                        resolve(res.rows);
                    });
                });
                promises.push(p);
                
            }
            else{
                let p = new Promise((resolve, reject) => {
                    this.client.query("UPDATE furniture SET isSeat=$1, width=$2, height=$3, x=$4, y=$5 WHERE pk=" + obj.id,[
                        obj.seat,
                        obj.width,
                        obj.height,
                        obj.x,
                        obj.y
                    ],(err, res) =>{
                        if (err){
                            reject(err);
                        }
                        resolve(res);
                    });
                });

                promises.push(p);
            }
        }
        Promise.all(promises).then((res) => {
            callback(res);
        }).catch((l) => {
            callback("Failed to update records.");
        });
    }

    deleteRoom(id, callback){
        this.client.query("DELETE FROM rooms WHERE pk=" + id, (err, res) => {
            if (err){
                console.log(err);
            }
            callback();
        }); 
    }

    

    
}

module.exports = queries;

