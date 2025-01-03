# Banner

This app demonstrates how to use the Senza version of the Shaka player to play video. When switching between foreground and background mode, the video timecode is automatically synchronized between the local player and the remote player.

See the [Playing Video](https://developer.synamedia.com/senza/docs/playing-video) tutorial in the Senza developer documentation.

## Interface

* OK - toggle between foreground and background mode
* Back - pause and play the video
* Left/Right - skip backwards and forwards by 30 seconds

## Build

```bash
npm install --save-dev webpack
npm ci
npx webpack -w --config webpack.config.js
open index.html
```
