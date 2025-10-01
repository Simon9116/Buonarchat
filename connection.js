const mysql = require("mysql2/promise");

const con = mysql.createConnection({
    host: process.env.DB_CONTAINER_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})

module.exports = con;