/**
 * Created by Mario on 2017-01-13.
 */
"use strict";
var WebSocket = require("ws");
var wss = new WebSocket.Server({ port: 29100 });
wss.on('connection', function (ws) {
    console.log('Connected');
    ws.on('error', function (error) {
        console.error(error);
    });
    ws.on('message', function (message) {
        console.log('received: %s', message);
    });
    ws.on('close', function (code, message) {
        console.log("Connection closed (" + code + " " + message + ")");
    });
    ws.send('test message from the server');
});
