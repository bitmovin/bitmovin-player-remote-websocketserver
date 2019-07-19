bitmovin-player-remote-websocketserver
======================================

A simple WebSocket server used to remote control one or many `WebSocketRemoteControlReceiver` players (a.k.a. the Chromecast receiver app with enabled WebSocket receiver) with one or more `WebSocketRemoteControl`-enabled players.

Quick Start
-----------

* Run the server with `npm start`
  * figure out the IP address or use `localhost`
* Launch receiver apps with (`grunt remotereceiver-serve` in `bitdash`)
  * Make sure the `WebSocketRemoteControlReceiver` in `cast-receiver/index.html` is not commented out
  * set the `url` to `ws://your-server-ip:29100`
* Configure player(s) with `remotecontrol` section

  ```js
  const playerConfig = {
    ...,
    remotecontrol: {
      type: 'websocket',
      url: 'ws://your-server-ip:29100',
    },
  };
  ```
* Validate server output
  * For every remote receiver instance there must be one `RemoteReceiver connected` message
  * For every remote controller (player) instance there must be one `Remote connected` message
* Use the Cast button to start a remote-control session with all receivers listening to the same server
  * If Cast button does not appear, simply call `player.castVideo();`