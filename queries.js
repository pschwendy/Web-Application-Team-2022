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
        ssl: { rejectUnauthorized: true }
    };
};

class queries {
    // Constructor
    // Connects pool to DB
    constructor() {
        console.log("-------IN HERE-------");
        this.pool = new Pool(connectionString);
        this.pool.connect().catch(e => { 
            console.log("-------COULDN'T CONNECT TO DATABASE!-------");
            throw(e); 
        });
        console.log("-------CONNECTED-------");
    } // constructor()

    deleteReservation(reservation_data) {
        const select = {
            text: "DELETE FROM reservations WHERE userID=$1 AND timestamp=TO_TIMESTAMP($2, $3)",
            values: [reservation_data.userID, reservation_data.date, reservation_data.formatting]
        }
        this.pool.query(select, (err) => {
            if(err) {
                throw err;
            }
            // console.log("AYYY");
        });
    }

    deleteEventReservation(reservation_data, callback) {
        const select = {
            text: "DELETE FROM reservations WHERE userID=$1 AND isseat=$2 AND event=$3 AND timestampTO_TIMESTAMP($4, $5)",
            values: [reservation_data.userID, reservation_data.isseat, reservation_data.event, reservation_data.timestamp, reservation_data.formatting]
        }
        this.pool.query(select, (err) => {
            if(err) {
                throw err;
            }
            return callback(true);
            console.log("AYYY");
        });
    }

    deleteSeatReservations(reservation_data, callback) {
        console.log("IN HERE");
        const select = {
            text: "DELETE FROM reservations WHERE userID=$1 AND isseat=$2 AND timestamp=TO_TIMESTAMP($3, $4)",
            values: [reservation_data.userID, reservation_data.isseat, reservation_data.timestamp, reservation_data.formatting]
        }
        this.pool.query(select, (err) => {
            if(err) {
                throw err;
            }
            return callback(true);
            console.log("AYYY");
        });
    }

    deleteAllReservations(){
        const select = {
            text: "DELETE FROM reservations",
            values: [reservation_data.pk, reservation_data.userID, reservation_data.date, reservation_data.formatting]
        }
        this.pool.query(select, (err, rows) => {
            console.log("ALL RESERVATIONS DELETED.");
        });
    }

    // Queries.signin()
    // Checks if database query @ username exists, if not, signs up w/ given parameters
    // Input: username -> username used for finding user in database
    // Input: password -> checks if found user has this password
    signin(email, password) {
        const select = {
            text: "SELECT * FROM users WHERE email=$1",
            values: [email]
        };
        return this.pool.query(select)
        .then(rows => {
            console.log("IN HERE");
            console.log(rows.rowCount);
            console.log(rows.rows);
            if (rows.rowCount == 0) {
                var result = {
                    pk: -1,
                    name: ""
                };
                console.log(result);
                return result;
            } else if(password == rows.rows[0].password) {
                var result = {
                    pk: rows.rows[0].pk,
                    name: rows.rows[0].name
                };
                console.log(result);
                return result;
            } else {
                var result = {
                    pk: -1,
                    name: ""
                };
                console.log(result);
                return result;
            }
        }).catch(err => { throw err; })
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
    signup(email, name, password) {
        const query = {
            text: "SELECT * FROM users WHERE email=$1",
            values: [email]
        };

        return this.pool.query(query)
        .then(rows => {
            console.log("HELLO");
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
                if(password == rows.rows[0].password) {
                    return rows.rows[0].pk;
                }
                
            }
        })
        .catch(e => { throw e });
        /*const query = {
            text: "INSERT INTO users(email, username, password, name) VALUES ($1, $1, $2, $3)",
            values: [email, password, name]
        }


        return this.pool.query(query)
        .catch(err => {
            if(err) {
                throw(err);
            }
            return callback(true);
        });*/
    } // signup()
    

    // Queries.addReservations()
    // Adds a list of reservation to the database
    // Input: newReservations -> gee, I wonder what these are
    addReservations(newReservations, callback) {
        var promises = [];
        for( var reservationX of newReservations) {
            //console.log("The power of the sun, in the palm of my hand:");
            var p = new Promise((resolve, reject) => {
                var reservation = reservationX;
                //console.log(reservation);
                const select = {
                    text: "SELECT pk FROM reservations WHERE seatID=$1 AND timestamp=TO_TIMESTAMP($2, $3)",
                    values: [reservation.seatID, reservation.date, reservation.formatting]
                };
        
                this.pool.query(select, (err, rows) => {
                    if(err) {
                        throw err;
                    } else if (rows.length > 0) {
                        reject("Too many rows");
                    }
    
                    //console.log("GIVE ME OUTPUT:", reservation.seatID);

                    var query = {
                        text: "INSERT INTO reservations(isSeat, userID, seatID, timestamp) VALUES ($5, $1, $2, TO_TIMESTAMP($3, $4))",
                        values: [reservation.userID, reservation.seatID, reservation.date, reservation.formatting, reservation.seat]
                    }
            
                    this.pool.query(query, (err, rows) => {
                        //console.log("You know, I'm something of a result myself.");
                        //console.log(rows);
                        if(err) {
                            reject(err);
                        }
                        resolve("DOne");
                    });
                });
            });
            
            promises.push(p);

        }
        Promise.all(promises).then((resolve) => {
            //console.log("WELL DONE");
            return callback(true);
        }).catch((err) => {
            //console.log("Stings, doesn't it", err);
            return callback(false);
        });
        
    } // addReservations()
    
    addNonSeatReservations(newReservations, callback) {
        var promises = [];
        for( var reservationX of newReservations) {
            //console.log("The power of the sun, in the palm of my hand:");
            var p = new Promise((resolve, reject) => {
                var reservation = reservationX;
                //console.log(reservation);
                const select = {
                    text: "SELECT pk FROM reservations WHERE eventID=$1 AND timestamp=TO_TIMESTAMP($2, $3)",
                    values: [reservation.eventID, reservation.date, reservation.formatting]
                };
        
                this.pool.query(select, (err, rows) => {
                    if(err) {
                        throw err;
                    } 

                    const select2 = {
                        text: "SELECT * FROM events WHERE pk=$1",
                        values: [reservation.eventID]
                    }

                    this.pool.query(select2, (err, results)=>{
                        if (err){
                            reject("errored out");
                        }
                        console.log(reservation.eventID);
                        console.log("**************************LOOOK HERE**********************");
                        console.log(results.rows[0]["name"]);
                        if (results.rows[0]["capacity"] < rows.rows.length){
                            reject("Overfilled");
                        }
                        else{
                            var query = {
                                text: "INSERT INTO reservations(isSeat, userID, eventID, event, timestamp) VALUES ($5, $1, $2, $6, TO_TIMESTAMP($3, $4))",
                                values: [reservation.userID, reservation.eventID, reservation.date, reservation.formatting, reservation.seat, results.rows[0]["name"]]
                            }
                    
                            this.pool.query(query, (err, rows) => {
                                //console.log("You know, I'm something of a result myself.");
                                //console.log(rows);
                                if(err) {
                                    reject(err);
                                }
                                resolve("Done");
                            });
                        }
                    });
    
                    //console.log("GIVE ME OUTPUT:", reservation.seatID);

                   
                });
            });
            
            promises.push(p);

        }
        Promise.all(promises).then((resolve) => {
            //console.log("WELL DONE");
            return callback(true);
        }).catch((err) => {
            //console.log("Stings, doesn't it", err);
            return callback(false);
        });
        
    } // addReservations()

    createEvent(name, description, path, capacity, callback){
        const select = {
            text: "INSERT INTO events(name, description, capacity, image) VALUES ($1, $2, $3, $4)",
            values: [name, description, capacity, path]
        }
        this.pool.query(select, (err, res) => {
            if (err){
                console.log(err);
            }
            callback(res);
        });
    }

    //gets all events from the events table
    getEvents(callback){
        this.pool.query("SELECT * FROM events", (err, res) => {
            if (err){
                console.log("FAILED TO GET EVENTS");
            }
            callback(res.rows);
        });
    }

    // Queries.getReservations()
    // Gets a user's reservations
    // Input: userpk -> userID
    getReservations(userpk, callback) {
        const select = {
            text: "SELECT * FROM reservations WHERE userID=$1 ORDER BY timestamp ASC",
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

    clearFurniture(callback){
        this.pool.query("DELETE FROM furniture", (err, res) => {
            if (err){
                console.log(err);
            }
            callback(res);
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

    getAvailableSeats(room, timeData, callback) {
        const select = {
            text: "SELECT * FROM furniture WHERE roomID=$1 AND pk NOT IN (SELECT seatID FROM reservations WHERE timestamp=TO_TIMESTAMP($2, $3))",
            values: [room, timeData["time"], timeData["format"]]
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

    getUnavailableSeats(room, timeData, callback) {
        const select = {
            text: "SELECT * FROM furniture WHERE roomID=$1 AND pk IN (SELECT seatID FROM reservations WHERE timestamp=TO_TIMESTAMP($2, $3))",
            values: [room, timeData["time"], timeData["format"]]
        };

        this.pool.query(select, (err, rows) => {
            if(err) {
                console.log(err);
                throw(err);
            } else {
                //console.log("DO YOU KNOW HOW MUCH I SACRIFICED: " + rows.rows.length);
                return callback(rows.rows);
            }
        });
    }
}

module.exports = queries;