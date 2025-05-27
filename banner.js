import * as senza from "senza-sdk";

let options = {
  "url": getParam("url", "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"),
  "licenseServer": getParam("licenseServer", null),
  "autoBackground": getParam("autoBackground", "true") == "true",
  "delay": Number(getParam("delay", 15)),
  "maxHeight": Number(getParam("maxHeight", 1080)),
  "time": Number(getParam("time", 0)),
  "audio": getParam("audio", null),
  "text": getParam("text", null),
}

let player;

window.addEventListener("load", async () => {
  try {
    await senza.init();
    player = new senza.ShakaPlayer();
    player.configure(playerConfig());
    await player.attach(video);
    await player.load(options.url);
    await video.play();

    if (options.time) video.currentTime = options.time;
    player.remotePlayer.addEventListener("tracksupdate", () => {
      if (options.audio) player.selectAudioLanguage(options.audio);
      if (options.text) player.selectTextLanguage(options.text);
      if (options.text) banner.style.opacity = 0;
      player.setTextTrackVisibility(options.text != null);
    });

    senza.lifecycle.autoBackground = options.autoBackground;
    senza.lifecycle.autoBackgroundDelay = options.delay;
    senza.lifecycle.addEventListener("onstatechange", updateBanner);

    senza.uiReady();
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("keydown", async function (event) {
  switch (event.key) {
    case "Enter": await toggleBackground(); break;
    case "Escape": await playPause(); break;
    case "ArrowLeft": skip(-30); break;
    case "ArrowRight": skip(30); break;
    case "ArrowUp": break;
    case "ArrowDown": break;
    default: return;
  }
  event.preventDefault();
});

async function toggleBackground() {
  if (senza.lifecycle.state == senza.lifecycle.UiState.BACKGROUND) {
    await senza.lifecycle.moveToForeground();
  } else {
    await senza.lifecycle.moveToBackground();
  }
}

async function playPause() {
  if (video.paused) {
    await video.play();
  } else {
    await video.pause();
  }
}

function skip(seconds) {
  video.currentTime = video.currentTime + seconds;
}

function updateBanner() {
  console.log("onstatechange", senza.lifecycle.state);
  banner.style.opacity = senza.lifecycle.state === senza.lifecycle.UiState.IN_TRANSITION_TO_BACKGROUND ? 0.5 : 0.9;
}

function getParam(name, defaultValue = null) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has(name) ? urlParams.get(name) : defaultValue;
}

function playerConfig() {
  let config = {abr: {restrictions: {maxHeight: options.maxHeight}}};
  if (options.licenseServer) {
    config.drm = {servers: {"com.widevine.alpha": options.licenseServer}};
  }
  return config;
}
