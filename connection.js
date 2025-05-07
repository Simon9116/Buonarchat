const mysql = require("mysql2");
const con = mysql.createConnection({
    host: process.env.DB_CONTAINER_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

con.connect(function(err) {
    if (err) throw err;
    console.log("DB connection ok");
});

module.exports = con;