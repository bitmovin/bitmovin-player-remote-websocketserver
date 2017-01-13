/**
 * Created by Mario on 2017-01-13.
 */

import * as WebSocket from 'ws';

let ws = new WebSocket('ws://localhost:29100');

ws.on('open', function open() {
  ws.send('something from the client');
});

ws.on('message', function incoming(data, flags) {
  // flags.binary will be set if a binary data is received.
  // flags.masked will be set if the data was masked.
  console.log(data);
});