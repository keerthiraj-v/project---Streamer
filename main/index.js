const express = require("express");
const app = express();
const http = require('http');
const server = http.createServer(app)
const cors = require('cors');
const fs = require("fs");
const router = require('./api/router');

app.use(cors())
app.use(express.static('interface'))
app.use('/api', router)

app.use('/hls', (req, res) => {
    const filePath = '.' + req.url;
    fs.readFile(filePath, (error, content) => {
        res.set('Access-Control-Allow-Origin', '*');
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', (error, content) => {
                    res.status(404).send(content);
                });
            } else {
                res.status(500).send(`Sorry, check with the site admin for error: ${error.code} ..\n`);
            }
        } else {
            res.status(200).send(content);
        }
    });
})

app.get("*", function (req, res) {
    res.sendFile(__dirname + "/interface/index.html");
});

server.listen(3001, () => console.log("Streaming on port 3001"))