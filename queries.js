const { Pool } = require('pg');
const bcrypt = require("bcryptjs");
const e = require('express');

// await pool.connect()
const env = process.env.NODE_ENV || 'development';

/*
let connectionString = {
    user: 'postgres',
    password: 'postgres1245',
    port: 5433,
};
*/

let connectionString = {
    user: 'event',
    password: 'supersecretpassword',
    port: 5432,
};


// checking to know the environment and suitable connection string to use
if (env === 'development') {
    connectionString.database = 'eventdb';
} else {
    connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    };
};

class queries {
    // Constructor
    // Connects pool to DB
    constructor() {
        this.pool = new Pool(connectionString);
        this.pool.connect();
    } // constructor()

    // Queries.signin()
    // Checks if database query @ username exists, if not, signs up w/ given parameters
    // Input: username -> username used for finding user in database
    // Input: password -> checks if found user has this password
    signin(email, callback, password = "g") {
        const select = {
            text: "SELECT password FROM users WHERE email=$1",
            values: [email]
        };

        this.pool.query(select, (err, rows) => {
            if(err) {
                throw err;
            } else if (rows.length == 0) {
                return callback(false);
            } else if(password == rows.rows[0].password) {
                return callback(true);
            }
        });
    } // signin()

    // Queries.googleSignIn()
    // Checks if database query @ username has password = input password
    // Input: username -> username used for finding user in database
    // Input: password -> checks if found user has this password
    /*async googleSignIn(email,name, success) {
        
    } */// googleSignIn()

    // Queries.googleSignIn()
    // Signs In assuming a google account
    async googleSignIn(email, name) {
        const query = {
            text: "SELECT * FROM users WHERE email=$1",
            values: [email]
        };

        return await this.pool.query(query)
        .then(rows => {
            if (rows.rowCount == 0) {
                const query = {
                    text: "INSERT INTO users(email, password, name) VALUES ($1, $2, $3)",
                    values: [email, "g", name]
                }
        
                return this.pool.query(query).then(()=> {
                    return this.getUserInfo(email);
                }).catch((err) => {
                    throw(err);
                });
            } else {
                return rows.rows[0].pk;
            }
        })
        .catch(e => { throw e });
    } // googleSignUp()

    // Signs Up assuming a google account
    getUserInfo(email) {
        const query = {
            text: "SELECT * FROM users WHERE email=$1",
            values: [email]
        };

        return this.pool.query(query)
        .then(rows => {
            if (rows.rowCount == 0) {
                return -1;
            } else {             
                console.log("IN HERE");  
                return rows.rows[0].pk;
            }
        })
        .catch(e => { throw e });
    } // googleSignUp()

    // Queries.signup()
    // Checks if database query @ username exists, if not, signs up w/ given parameters
    // Input: username -> username of new user
    // Input: password -> password of new user
    signin(email, callback, name, password = "g") {
        const query = {
            text: "INSERT INTO users(email, username, password, name) VALUES ($1, $1, $2, $3)",
            values: [email, password, name]
        }


        this.pool.query(query, (err) => {
            if(err) {
                throw(err);
            }
            return callback(true);
        });
    } // signup()
    

    // Queries.addReservations()
    // Adds a list of reservation to the database
    // Input: newReservations -> gee, I wonder what these are
    addReservations(newReservations, callback) {
        var good = true;
        for(reservation of newReservations) {
            const select = {
                text: "SELECT pk FROM reservations WHERE seatID=$1, timestamp=$2",
                values: [reservation.seatID, reservation.timestamp]
            };
    
            this.pool.query(select, (err, rows) => {
                if(err) {
                    throw err;
                } else if (rows.length == 0) {
                    return callback(false);
                }

                const query = {
                    text: "INSERT INTO reservations(userID, seatID, timestamp) VALUES ($1, $2, $3)",
                    values: [reservation.userID, reservation.seatID, reservation.timestamp]
                }
        
                this.pool.query(query, (err) => {
                    if(err) {
                        throw(err);
                    }
                });
            });
        }
        return callback(good);
    } // addReservations()

    // Queries.getReservations()
    // Gets a user's reservations
    // Input: userpk -> userID
    getReservations(userpk, callback) {
        const select = {
            text: "SELECT * FROM reservations WHERE userID=$1",
            values: [userpk]
        };

        return this.pool.query(select)
        .then(rows => {
            return callback(rows.rows);
        })
        .catch(err => { throw err; });
    } // addReservations()

    // Queries.createRoom()
    // To be used by Admin
    // Creates a new room by name
    createRoom(name, callback) {
        // var client = this.client;
        const insert = {
            text: "INSERT INTO rooms(name) VALUES($1)",
            values: [name]
        };

        this.pool.query(insert, (err, res) => {
            if (err){
              console.log(err);
            }
            callback(res);
         });
    }

    // Queries.getRooms()
    // Returns all the rooms from the database
    getRooms(callback) {
        const select = {
            text: "SELECT * FROM rooms",
        };

        this.pool.query(select, (err, res) => {
            if (err){
                console.log(err);
            }
            callback(res.rows);
        });
    } // getRooms()

    // !WE SHOULD NOT BE USING A FUNCTION LIKE THIS; I HAVE AN ALTERNATIVE METHOD -Peter
    // Queries.getRooms()
    // Returns the id of a room by name
    getRoomID(name, callback) {
        this.pool.query("SELECT * FROM rooms WHERE name='" + name + "'", (err, res) => {
            if (err){
                console.log(err);
            }
            callback(res.rows[0]['pk']);
        });
    } // getRooms()

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

    // Queries.editObjectsInRoom()
    // To be used by admin
    // Edits placement of objects in a room
    editObjectsInRoom(id, data, callback) {
        console.log("editing");
        var promises = [];
        for (var x = 0; x < data.length; x++) {
            var obj = data[x];
            if (obj.seat) {
                obj.width = 20;
                obj.height = 20;
            }

            if (obj.new) {
                let p = new Promise((resolve, reject) => {
                    this.pool.query("INSERT INTO furniture(isseat, width, height, x, y, available, roomID) VALUES($1, $2, $3, $4, $5, $6, $7)",
                    [
                        obj.isseat, obj.width, obj.height, obj.x, obj.y, true, id
                    ], (err, res) => {
                        if (err){
                            reject(err);
                        }
                        resolve(res.rows);
                    });
                });
                promises.push(p);  
            } else {
                console.log("Updating an old one");
                let p = new Promise((resolve, reject) => {
                    this.pool.query("UPDATE furniture SET isSeat=$1, width=$2, height=$3, x=$4, y=$5 WHERE pk=" + obj.pk,[
                        obj.isseat, obj.width, obj.height, obj.x, obj.y
                    ],(err, res) =>{
                        if (err){
                            console.log("here batta batta");
                            console.log(err);
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
    } // editObjectsInRoom()

    // Queries.deleteRoom()
    // To be used by admin
    // Deletes Room
    deleteRoom(id, callback) {
        this.pool.query("DELETE FROM rooms WHERE pk=" + id, (err, res) => {
            if (err){
                console.log(err);
            }
            callback();
        }); 
    } // deleteRoom()

    deleteObjects(ids, callback){
        var promises = [];
        for (var id of ids){
            let p = new Promise((resolve, reject) => {
                this.pool.query("DELETE FROM furniture WHERE pk=" + id, (err, res) => {
                    if (err){
                        reject(err);
                    }
                    resolve(res);
                });
            });
            promises.push(p);
        }
        Promise.all(promises).then((results) => {
            callback(results);
        }).catch((err) => {
            console.log(err);
        });
    }

    // Queries.getSeats()
    // Returns the seats in a given room
    // Input: room -> pretty self-explanatory if you ask me
    getSeats(room, callback) {
        const select = {
            text: "SELECT * FROM furniture WHERE roomID=$1",
            values: [room]
        };

        this.pool.query(select, (err, rows) => {
            if(err) {
                console.log(err);
                throw(err);
            } else {
                return callback(rows.rows);
            }
        });
    } // getSeats()
}

module.exports = queries;