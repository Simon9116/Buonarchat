const express = require('express');
const conPromise = require("../connection");

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login', {});
});

router.post('/', async (req, res) => {
    const con = await conPromise;

    let username = req.body.username;
    let password = req.body.password;

    const [result, fields] = await con.execute("SELECT id, username FROM UserAccount WHERE username=? AND password=?", [username, password])
    if (result) {
        let user = result[0];
        req.session.user = {id: user.id, username: user.username};
        res.redirect("/chat/1")
    }
    else {
        res.redirect('/login');
    }
});

module.exports = router;