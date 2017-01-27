/**
 * Created by Mario on 2017-01-13.
 */

import * as WebSocket from 'ws';

let wss = new WebSocket.Server({ port: 29100 });

let remoteSockets: WebSocket[] = [];
let remoteReceiverSockets: WebSocket[] = [];

wss.on('connection', function(ws) {
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

let handleRemoteSocket = function(ws: WebSocket): void {
  remoteSockets.push(ws);

  ws.on('error', function(error: Error) {
    console.error(error);
  });
  ws.on('message', function(data) {
    console.log('received: %s', data);

    // Relay message from remote to all remote receivers
    for (let socket of remoteReceiverSockets) {
      socket.send(data);
    }
  });
  ws.on('close', function(code: number, message: string) {
    console.log(`Remote connection closed (${code} ${message})`);

    // Remove remote from list of connected remotes
    remoteItemFromArray(remoteSockets, ws);
  });
};

let handleRemoteReceiverSocket = function(ws: WebSocket): void {
  remoteReceiverSockets.push(ws);

  ws.on('error', function(error: Error) {
    console.error(error);
  });
  ws.on('message', function(data) {
    console.log('received: %s', data);

    // Relay message from receiver to all remotes
    for (let socket of remoteSockets) {
      socket.send(data);
    }
  });
  ws.on('close', function(code: number, message: string) {
    console.log(`RemoteReceiver connection closed (${code} ${message})`);

    // Remove receiver from list of connected receivers
    remoteItemFromArray(remoteReceiverSockets, ws);
  });
};

enum Role {
  Unknown,
  Remote,
  RemoteReceiver,
}

let getRole = function(ws: WebSocket): Role {
  if (ws.upgradeReq.url.indexOf('role=receiver') === 2) {
    return Role.RemoteReceiver;
  } else if (ws.upgradeReq.url.indexOf('role=remote') === 2) {
    return Role.Remote;
  }
  return Role.Unknown;
};

let remoteItemFromArray = function(array: any[], item: any): void {
  let index = array.indexOf(item);
  array.splice(index, 1);
};