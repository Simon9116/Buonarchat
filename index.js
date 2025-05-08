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

const app = express();

const hostname = (process.env.STATUS === "production")? process.env.PROD_HOST : process.env.DEV_HOST;
const port = (process.env.STATUS === "production")? process.env.PROD_PORT : process.env.DEV_PORT;

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));

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

app.get('/login', (req, res) => {
    res.render('login', {});
})

app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    con.prepare("SELECT id, username FROM UserAccount WHERE username=? AND password=?", (err, stmt) => {
        if (err) throw err;

        stmt.execute([username, password], (err, result) => {
            if (err) throw err;

            if (result[0] !== null) {
                let user = result[0];
                req.session.user = {id: user.id, username: user.username};
                res.redirect("/chat/1")
            }
            else {
                res.redirect('/login');
            }
        });
        stmt.close();
    });
});

app.get('/signup', (req, res) => {
    res.render('signup', {});
})

app.post('/signup', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    con.prepare("INSERT INTO UserAccount(username,password) VALUES (?,?)", (err, stmt) => {
        if (err) throw err;

        stmt.execute([username,password], (err, result) => {
            if (err) {
                res.redirect('signup')
            }

            res.redirect("/login");
        });
    });
})

app.get('/chat/:chatId', (req, res) => {
    res.render('chat', {messages: [], chatId: req.params.chatId, userId: req.session.user.id});
})

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