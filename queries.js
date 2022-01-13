const { Pool } = require('pg');
const bcrypt = require("bcryptjs");
const e = require('express');

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
                    good = false;
                    break;
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

    // Queries.getSeats()
    // Returns the seats in a given room
    // Input: room -> pretty self-explanatory if you ask me
    getSeats(room, callback) {
        const select = {
            text: "SELECT * FROM furniture WHERE room=$1",
            values: [room]
        };

        this.pool.query(select, (err, rows) => {
            if(err) {
                throw(err);
            } else {
                return callback(rows.rows);
            }
        });
    }
}

module.exports = queries;