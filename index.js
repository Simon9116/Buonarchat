const express = require('express');
const session = require('express-session');
const http = require('http');
const https = require('https');
const engine = require("ejs-mate");
const mysql = require("mysql2");
const favicon = require("serve-favicon");
const {Server} = require("socket.io")
const { join } = require('path');
const { readFileSync } = require("fs");
const con = require("./connection");
const auth = require("./auth");

const login = require("./routes/login");
const signup = require("./routes/signup");
const chat = require("./routes/chat");

const app = express();

const hostname = (process.env.STATUS === "production")? process.env.PROD_HOST : process.env.DEV_HOST;
const port = (process.env.STATUS === "production")? process.env.PROD_PORT : process.env.DEV_PORT;

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

//middleware
app.use(favicon(join(__dirname, "public", "favicon.ico")));
app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(auth);

//routes
app.use("/login", login);
app.use("/signup", signup);
app.use("/chat", chat);


let server = null;
if(process.env.STATUS === "production") {
    server = https.createServer({
        key: readFileSync(join(__dirname, 'cert/server.key')),
        cert: readFileSync(join(__dirname, 'cert/server.cert'))
    }, app);
}
else {
    server = http.createServer(app);
}
server.listen(port, hostname, () => {
    console.log(`Listening at ${hostname}:${port}`);
});


const io = new Server(server);
io.on('connection', (socket) => {
    console.log('Connection established with: ' + socket.id);
});

const namespace = io.of('/chat');
let group;
namespace.on('connection', (socket) => {
    socket.on('joinRoom', (roomName) => {
        group = roomName;
        socket.join(roomName);
        console.log(`${socket.id} joined room: ${roomName}`);
    });

    socket.on('message', (msg) => {
        console.log("Received: " + msg);
        socket.to(group).emit("message", msg);

        let parsedMsg = JSON.parse(msg);

        con.prepare("INSERT INTO Message(author,chat,content) VALUES (?,?,?)", (err, stmt) => {
            if (err) throw err;

            stmt.execute([parseInt(parsedMsg.sender),group,parsedMsg.text], (err, result) => {
                if (err) throw err;
            });
        });

    });
});