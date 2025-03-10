# Banner

This app demonstrates how to use the Senza version of the Shaka player to play video. When switching between foreground and background mode, the video timecode is automatically synchronized between the local player and the remote player.

See the [Playing Video](https://developer.synamedia.com/senza/docs/playing-video) tutorial in the Senza developer documentation.

## Interface

* OK - toggle between foreground and background mode
* Back - pause and play the video
* Left/Right - skip backwards and forwards by 30 seconds

## Options

You can change the behavior of the app using these URL query parameters:

* url - the URL of the video stream (default = Big Buck Bunny)
* licenseServer - the license server for protected content (default = null)
* autoBackground - switch to background automatically after a period of inactivty (default = true)
* delay - how many seconds to wait before switching to background (default = 15)
* maxHeight -  the maximum resolution of the video (default = 1080)

## Build

```bash
npm install --save-dev webpack
npm ci
npx webpack -w --config webpack.config.js
open index.html
```
