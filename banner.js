import { init, uiReady, lifecycle, alarmManager, messageManager } from "@Synamedia/hs-sdk";
import { videoManager } from "./videoManager.js";
import shaka from "shaka-player";

const TEST_VIDEO = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
const MUTE = true;

window.addEventListener("load", async () => {
  try {
    await init();
    videoManager.init(new shaka.Player(video));
    await videoManager.load(TEST_VIDEO);
    videoManager.play();
    uiReady();

    messageManager.registerGroups(["Banner"]);
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
    case "ArrowUp": setAlarm(); break;      
		default: return;
	}
	event.preventDefault();
});

function setAlarm() {
  alarmManager.addAlarm("alarm", Date.now() + 15000, "THIS IS A NEW BANNER SET BY AN ALARM!");
  videoManager.toggleBackground();
}

alarmManager.addEventListener("alarm", (e) => {
    banner.innerHTML = e.detail;
    lifecycle.moveToForeground();
});

messageManager.addEventListener("message", async (event) => {
  const currentState = await lifecycle.getState();
  if (currentState == "background" || currentState == "inTransitionToBackground") {
    lifecycle.moveToForeground();
  }
  banner.innerHTML = event.detail.payload;
});