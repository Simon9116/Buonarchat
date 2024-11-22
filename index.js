const express = require('express');
const https = require('https');
const engine = require("ejs-mate");
const { join } = require('path');
const { readFileSync } = require("fs");
require('dotenv').config();

const app = express();

const hostname = (process.env.STATUS === "production")? process.env.PROD_HOST : process.env.DEV_HOST;
const port = (process.env.STATUS === "production")? process.env.PROD_PORT : process.env.DEV_PORT;

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.get('/', (req, res) => {
    res.render('index');
});

if(process.env.STATUS === "production") {
    https.createServer({
        key: readFileSync(join(__dirname, 'cert/server.key')),
        cert: readFileSync(join(__dirname, 'cert/server.cert'))
    }, app).listen(port, hostname, () => {
        console.log(`Listening at: https://${hostname}:${port}`);
    });
}
else {
    app.listen(port, hostname, () => {
        console.log(`Listening at http://${hostname}:${port}`);
    })
}