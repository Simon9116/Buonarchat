const express = require('express');
const router = express.Router();
const con = require("../connection");

router.get('/:chatId', (req, res) => {
    let chats;
    con.prepare("SELECT c.id, c.name FROM UserChat uc JOIN Chat c ON uc.chat = c.id WHERE userAccount=?", (err, stmt) => {
        if (err) throw err;
        stmt.execute([req.session.user.id], (err, result) => {
            if (err) throw err;
            chats = result;
        })
    })

    con.prepare("SELECT * FROM Message WHERE chat=?", (err, stmt) => {
        if (err) throw err;
        stmt.execute([req.params.chatId], (err, result) => {
            if (err) throw err;
            res.render('chat', {chats: chats, messages: result, chatId: req.params.chatId, userId: req.session.user.id});
        })
    })
});

module.exports = router;