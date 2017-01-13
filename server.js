/**
 * Created by Mario on 2017-01-13.
 */
"use strict";
var WebSocket = require("ws");
var wss = new WebSocket.Server({ port: 29100 });
var sockets = [];
wss.on('connection', function (ws) {
    console.log('Connected');
    sockets.push(ws);
    ws.on('error', function (error) {
        console.error(error);
    });
    ws.on('message', function (data) {
        console.log('received: %s', data);
        // Relay message to all clients except the sender
        for (var _i = 0, sockets_1 = sockets; _i < sockets_1.length; _i++) {
            var socket = sockets_1[_i];
            if (socket != null && socket != ws) {
                socket.send(data);
            }
        }
    });
    ws.on('close', function (code, message) {
        console.log("Connection closed (" + code + " " + message + ")");
        // Remove client from list of connected clients
        var index = sockets.indexOf(ws);
        sockets.splice(index, 1);
    });
    ws.send('test message from the server');
});
