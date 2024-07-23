import {init, remotePlayer, uiReady} from "senza-sdk";
import { videoManager } from "./videoManager.js";
import shaka from "shaka-player";

const TEST_VIDEO = "https://d1m2jsqth0tf37.cloudfront.net/clear/linear/Nature-Insects_HD/default.mpd";

window.addEventListener("load", async () => {
  try {
    await init();
    videoManager.init(new shaka.Player(video));
    videoManager.remotePlayer.registerVideoElement(video)
    await videoManager.load(TEST_VIDEO);
    videoManager.play();

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
uiReady();
