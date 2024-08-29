import { init, uiReady } from "senza-sdk";
import { videoManager } from "./videoManager.js";

const TEST_VIDEO = "https://d1m2jsqth0tf37.cloudfront.net/clear/linear/Nature-Insects_HD/default.mpd";

function getState() {
	return window.sessionStorage.getItem("state");
}

function setState(state) {
	window.sessionStorage.setItem("state", state);
}

window.addEventListener("load", async () => {
	try {
		await init();
		videoManager.init(video);
		if (!getState()) { // First load
			await videoManager.load(TEST_VIDEO);
			videoManager.play();
			setState("{}");
		} else {
			await videoManager.localPlayerLoad(TEST_VIDEO);
		}
		uiReady();
	} catch (error) {
		console.error(error);
	}
});

document.addEventListener("keydown", async function(event) {
	switch (event.key) {
		case "Enter": await videoManager.togglePlayers(); break;
		case "Escape": videoManager.togglePlayPause(); break;
		case "ArrowLeft": videoManager.seek(-30); break;
		case "ArrowRight": videoManager.seek(30); break;
		default: return;
	}
	event.preventDefault();
});
