import { init, uiReady, ShakaPlayer, lifecycle } from "senza-sdk";

const TEST_VIDEO = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

let player;

window.addEventListener("load", async () => {
  try {
    await init();
    player = new ShakaPlayer();
    await player.attach(video);
    await player.load(TEST_VIDEO);
    await video.play();

    lifecycle.autoBackgroundDelay = 15;
    lifecycle.autoBackground = true;
    lifecycle.addEventListener("onstatechange", updateBanner);

    uiReady();
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
  if (lifecycle.state == lifecycle.UiState.BACKGROUND) {
    await lifecycle.moveToForeground();
  } else {
    await lifecycle.moveToBackground();
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
  banner.style.opacity = lifecycle.state === lifecycle.UiState.IN_TRANSITION_TO_BACKGROUND ? 0.5 : 0.9;
}