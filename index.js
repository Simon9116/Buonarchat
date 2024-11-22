const express = require('express');
const { join } = require('path');

const app = express();

const port = 3000;
const hostname = 'localhost';

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(port, hostname, () => {
    console.log(`Listening on http://${hostname}:${port}`);
})

