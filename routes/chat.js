const express = require('express');
const conPromise = require("../connection");

const router = express.Router();

router.get('/:chatId', async (req, res) => {
    const con = await conPromise;

    const [chats, fields1] = await con.execute("SELECT c.id, c.name FROM UserChat uc JOIN Chat c ON uc.chat = c.id WHERE userAccount=?", [req.session.user.id]);

    const [messages, fields2] = await con.execute("SELECT * FROM Message WHERE chat=?", [req.params.chatId]);
    res.render('chat', {chats: chats, messages: messages, chatId: req.params.chatId, userId: req.session.user.id});
});

module.exports = router;