const Pool = require('pg').Pool
require('dotenv').config()

let host = process.env.HOST;
let password = process.env.PASSWORD;
let database = process.env.DATABASE;
let username = process.env.USERNAME;

const pool = new Pool ({
    user: 'postgres',
    password: password,
    host: host,
    port: 5432,
    database: database
});

module.exports = pool;