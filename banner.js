import { init, uiReady } from "@Synamedia/hs-sdk";
import { videoManager } from "./videoManager.js";
import shaka from "shaka-player";

const TEST_VIDEO = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

window.addEventListener("load", async () => {
  try {
    await init();
    videoManager.init(new shaka.Player(video));
    await videoManager.load(TEST_VIDEO);
    videoManager.play();
    uiReady();
  } catch (error) {
    console.error(error);
  }
});

document.addEventListener("keydown", async function(event) {
	switch (event.key) {
    case "Enter": await videoManager.toggleBackground(); break;
    case "Escape": videoManager.playPause(); break;
    case "ArrowLeft": videoManager.skip(-30); break;
    case "ArrowRight": videoManager.skip(30); break;      
		default: return;
	}
	event.preventDefault();
});
