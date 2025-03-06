import * as senza from "senza-sdk";

let config = {
  "url": getConfig("url", "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"),
  "licenseServer": getConfig("licenseServer", null),
  "autoBackground": getConfig("autoBackground", "true") == "true",
  "delay": Number(getConfig("delay", 15))
}

let player;

window.addEventListener("load", async () => {
  try {
    await senza.init();
    player = new senza.ShakaPlayer();
    await player.attach(video);
    if (config.licenseServer) {
      player.configure({drm: {servers: {"com.widevine.alpha": config.licenseServer}}});
    }

    await player.load(config.url);
    await video.play();

    senza.lifecycle.autoBackgroundDelay = config.delay;
    senza.lifecycle.autoBackground = config.autoBackground;
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

function getConfig(name, defaultValue = null) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(name) ? urlParams.get(name) : defaultValue;
}
