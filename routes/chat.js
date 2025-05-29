const express = require('express');
const conPromise = require("../connection");

const router = express.Router();

async function fetchChats(userId) {
    const con = await conPromise;
    const [chats, fields] = await con.execute("SELECT c.id, c.name FROM UserChat uc JOIN Chat c ON uc.chat = c.id WHERE userAccount=?", [userId]);

    return chats;
}

router.get("/", async (req, res) => {
    const chats = await fetchChats(req.session.user.id);
    res.render('chat-index', {chats: chats});
});

router.get('/:chatId', async (req, res) => {
    const con = await conPromise;

    const [userChats, fields] = await con.execute("SELECT 1 FROM UserChat WHERE userAccount=? AND chat=?", [req.session.user.id, req.params.chatId]);
    if(userChats.length === 0) return res.redirect("/chat");

    const chats = await fetchChats(req.session.user.id);
    const [messages, fields2] = await con.execute("SELECT * FROM Message WHERE chat=?", [req.params.chatId]);
    res.render('chat', {chats: chats, messages: messages, chatId: req.params.chatId, userId: req.session.user.id});
});

module.exports = router;