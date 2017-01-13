/**
 * Created by Mario on 2017-01-13.
 */

import * as WebSocket from 'ws';

let wss = new WebSocket.Server({ port: 29100 });

let sockets: WebSocket[] = [];

wss.on('connection', function(ws) {
  console.log('Connected');
  sockets.push(ws);

  ws.on('error', function(error: Error) {
    console.error(error);
  });
  ws.on('message', function(data) {
    console.log('received: %s', data);

    // Relay message to all clients except the sender
    for(let socket of sockets) {
      if(socket != null && socket != ws) {
        socket.send(data);
      }
    }
  });
  ws.on('close', function(code: number, message: string) {
    console.log(`Connection closed (${code} ${message})`);

    // Remove client from list of connected clients
    let index = sockets.indexOf(ws);
    sockets.splice(index, 1);
  });

  ws.send('test message from the server');
});