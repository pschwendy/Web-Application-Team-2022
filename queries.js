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

}

module.exports = queries;

