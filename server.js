/**
 * Created by Mario on 2017-01-13.
 */
"use strict";
var WebSocket = require("ws");
var wss = new WebSocket.Server({ port: 29100 });
wss.on('connection', function connection(ws) {
    console.log(ws);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.send('something from the server');
});
