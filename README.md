# Banner Pro

This app demonstrates how to play video using the Senza version of the Shaka player, which handles integration with the remote player. After a few seconds of inactivity, it automatically switches from foreground to background mode.

This pro version of the [https://github.com/synamedia-senza/banner](banner) app loads the Senza SDK from an NPM package, supports protected content and subtitles, and has a number of customization options. 

See the [Playing Video](https://developer.synamedia.com/senza/docs/playing-video) tutorial in the Senza developer documentation.

## Options

You can configure the app's behavior using these query parameters:

* url - the URL of the video stream (default = Big Buck Bunny)
* licenseServer - the license server for protected content (default = null)
* autoBackground - switch to background automatically after a period of inactivty (default = true)
* delay - how many seconds to wait before switching to background (default = 15)
* maxHeight - the maximum resolution of the video (default = 1080)
* time - start the video this many seconds from the backgroundeginning (default = 0)
* audio - langauge code for audio (default = null)
* text - language code for subtitles (default = null)

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
