/**
 * Created by Mario on 2017-01-13.
 */

import * as WebSocket from 'ws';

let wss = new WebSocket.Server({ port: 29100 });

wss.on('connection', function(ws) {
  console.log('Connected');

  ws.on('error', function(error: Error) {
    console.error(error);
  });
  ws.on('message', function(message) {
    console.log('received: %s', message);
  });
  ws.on('close', function(code: number, message: string) {
    console.log(`Connection closed (${code} ${message})`);
  });

  ws.send('test message from the server');
});