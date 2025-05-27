const express = require('express');
const router = express.Router();
const con = require("../connection");

router.get('/', (req, res) => {
    res.render('login', {});
});

router.post('/', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    con.prepare("SELECT id, username FROM UserAccount WHERE username=? AND password=?", (err, stmt) => {
        if (err) console.log(err) //throw err;

        stmt.execute([username, password], (err, result) => {
            if (err) console.log(err) // throw err;

            if (result) {
                let user = result[0];
                req.session.user = {id: user.id, username: user.username};
                res.redirect("/chat/1")
            }
            else {
                res.redirect('/login');
            }
        });
    });
});

module.exports = router;