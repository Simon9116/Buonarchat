const express = require('express');
const conPromise = require("../connection");

const router = express.Router();


router.get('/', (req, res) => {
    res.render('signup', {});
});

router.post('/', async (req, res) => {
    const con = await conPromise;

    let username = req.body.username;
    let password = req.body.password;

    try {
        await con.execute("INSERT INTO UserAccount(username,password) VALUES (?,?)", [username,password]).catch();
        res.redirect("/login");
    } catch (err) {
        res.redirect('signup');
    }
});

module.exports = router;