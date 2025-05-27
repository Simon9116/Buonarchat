const express = require('express');
const router = express.Router();
const con = require("../connection");

router.get('/', (req, res) => {
    res.render('signup', {});
});

router.post('/', (req, res) => {
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
});

module.exports = router;