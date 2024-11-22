const express = require('express');
const https = require('https');
const { join } = require('path');
const { readFileSync } = require("fs");
require('dotenv').config();

const app = express();

const hostname = (process.env.STATUS === "production")? process.env.PROD_HOST : process.env.DEV_HOST;
const port = (process.env.STATUS === "production")? process.env.PROD_PORT : process.env.DEV_PORT;

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

if(process.env.STATUS === "production") {
    https.createServer({
        key: readFileSync(join(__dirname, 'cert/server.key')),
        cert: readFileSync(join(__dirname, 'cert/server.cert'))
    }, app).listen(443, () => {
        console.log(`Listening at: https://${hostname}:${port}`);
    });
}
else {
    app.listen(port, hostname, () => {
        console.log(`Listening at http://${hostname}:${port}`);
    })
}