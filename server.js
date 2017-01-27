/**
 * Created by Mario on 2017-01-13.
 */
"use strict";
var WebSocket = require("ws");
var wss = new WebSocket.Server({ port: 29100 });
var remoteSockets = [];
var remoteReceiverSockets = [];
wss.on('connection', function (ws) {
    switch (getRole(ws)) {
        case Role.Remote:
            console.log('Remote connected');
            handleRemoteSocket(ws);
            break;
        case Role.RemoteReceiver:
            console.log('RemoteReceiver connected');
            handleRemoteReceiverSocket(ws);
            break;
        default:
            console.error('Invalid role connected, dropping connection');
            ws.close();
            return;
    }
});
var handleRemoteSocket = function (ws) {
    remoteSockets.push(ws);
    ws.on('error', function (error) {
        console.error(error);
    });
    ws.on('message', function (data) {
        console.log('received: %s', data);
        // Relay message from remote to all remote receivers
        for (var _i = 0, remoteReceiverSockets_1 = remoteReceiverSockets; _i < remoteReceiverSockets_1.length; _i++) {
            var socket = remoteReceiverSockets_1[_i];
            socket.send(data);
        }
    });
    ws.on('close', function (code, message) {
        console.log("Remote connection closed (" + code + " " + message + ")");
        // Remove remote from list of connected remotes
        remoteItemFromArray(remoteSockets, ws);
    });
};
var handleRemoteReceiverSocket = function (ws) {
    remoteReceiverSockets.push(ws);
    ws.on('error', function (error) {
        console.error(error);
    });
    ws.on('message', function (data) {
        console.log('received: %s', data);
        // Relay message from receiver to all remotes
        for (var _i = 0, remoteSockets_1 = remoteSockets; _i < remoteSockets_1.length; _i++) {
            var socket = remoteSockets_1[_i];
            socket.send(data);
        }
    });
    ws.on('close', function (code, message) {
        console.log("RemoteReceiver connection closed (" + code + " " + message + ")");
        // Remove receiver from list of connected receivers
        remoteItemFromArray(remoteReceiverSockets, ws);
    });
};
var Role;
(function (Role) {
    Role[Role["Unknown"] = 0] = "Unknown";
    Role[Role["Remote"] = 1] = "Remote";
    Role[Role["RemoteReceiver"] = 2] = "RemoteReceiver";
})(Role || (Role = {}));
var getRole = function (ws) {
    if (ws.upgradeReq.url.indexOf('role=receiver') === 2) {
        return Role.RemoteReceiver;
    }
    else if (ws.upgradeReq.url.indexOf('role=remote') === 2) {
        return Role.Remote;
    }
    return Role.Unknown;
};
var remoteItemFromArray = function (array, item) {
    var index = array.indexOf(item);
    array.splice(index, 1);
};
