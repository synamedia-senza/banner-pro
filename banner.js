import * as senza from "senza-sdk";

let options = {
  "url": getParam("url", "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"),
  "licenseServer": getParam("licenseServer", null),
  "autoBackground": getParam("autoBackground", "true") == "true",
  "delay": Number(getParam("delay", 15)),
  "maxWidth": Number(getParam("maxWidth", 1920))
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

    senza.lifecycle.autoBackgroundDelay = options.delay;
    senza.lifecycle.autoBackground = options.autoBackground;
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
  banner.style.opacity = senza.lifecycle.state === senza.lifecycle.UiState.IN_TRANSITION_TO_BACKGROUND ? 0.5 : 0.9;
}

function getParam(name, defaultValue = null) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(name) ? urlParams.get(name) : defaultValue;
}

function playerConfig() {
  let config = {abr: {restrictions: {maxWidth: options.maxWidth}}};
  if (options.licenseServer) {
    config.drm = {servers: {"com.widevine.alpha": options.licenseServer}};
  }
  return config;
}
