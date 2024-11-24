const express = require('express');
const https = require('https');
const engine = require("ejs-mate");
const {Server} = require("socket.io")
const { join } = require('path');
const { readFileSync, stat} = require("fs");
require('dotenv').config();

const app = express();

const hostname = (process.env.STATUS === "production")? process.env.PROD_HOST : process.env.DEV_HOST;
const port = (process.env.STATUS === "production")? process.env.PROD_PORT : process.env.DEV_PORT;

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

app.use(express.static(join(__dirname, "public")));


app.get('/chat', (req, res) => {
    res.render('chat', {messages: []});
})

let server = null;
if(process.env.STATUS === "production") {
    server = https.createServer({
        key: readFileSync(join(__dirname, 'cert/server.key')),
        cert: readFileSync(join(__dirname, 'cert/server.cert'))
    }, app).listen(port, hostname, () => {
        console.log(`Listening at: https://${hostname}:${port}`);
    });
}
else {
    server = app.listen(port, hostname, () => {
        console.log(`Listening at http://${hostname}:${port}`);
    })
}

const io = new Server(server);
io.on('connection', (socket) => {
    console.log('Connection established with: ' + socket.id);
});
const namespace = io.of('/chat');
namespace.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log("Received: " + msg);
        namespace.emit("message", msg);
    })
});