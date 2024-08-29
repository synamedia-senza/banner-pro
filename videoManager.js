import { remotePlayer, lifecycle } from "senza-sdk";
import shaka from "shaka-player";

class VideoManager {

  init(videoElement) {
    this.localPlayer = new shaka.Player(videoElement);
    this.remotePlayer = remotePlayer;

    this.remotePlayer.registerVideoElement(videoElement);

    remotePlayer.addEventListener("ended", () => {
      lifecycle.moveToForeground();
    });

    lifecycle.addEventListener("onstatechange", (event) => {
      if (event.state === "background") {
        this.localPlayerPause();
      }
    });
  }

  async load(url) {
    try {
      await this.localPlayerLoad(url);
      await this.remotePlayerLoad(url);
    } catch (error) {
      console.log("Couldn't load.");
    }
  }

  play() {
    this.localPlayerPlay();
    this.remotePlayerPlay();
  }

  pause() {
    this.localPlayerPause();
    this.remotePlayerPause();
  }

  togglePlayPause() {
    if (this.localPlayerMedia().paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  seek(seconds) {
    // Seek API Not implemented
    // remotePlayer.currentTime sould be a setter
    remotePlayer.currentTime = this.localPlayerMedia().currentTime = this.localPlayerMedia().currentTime + seconds;
    remotePlayer.play(false);
  }

  localPlayerLoad(url) {
    return this.localPlayer.load(url);
  }

  localPlayerMedia() {
    return this.localPlayer.getMediaElement();
  }

  localPlayerPlay() {
    this.localPlayerMedia().play().catch(error => {
      console.log("Unable to play video. Possibly the browser will not autoplay video with sound.");
    });
  }

  localPlayerPause() {
    this.localPlayerMedia().pause();
  }

  remotePlayerLoad(url) {
    return remotePlayer.load(url);
  }

  remotePlayerPlay() {
    remotePlayer.play(false);
  }

  remotePlayerPause() {
    remotePlayer.pause();
  }

  async moveToLocalPlayer() {
    this.localPlayerMedia().currentTime = remotePlayer.currentTime || 0;
    this.localPlayerPlay();
    lifecycle.moveToForeground();
  }

  moveToRemotePlayer() {
    let currentTime = this.localPlayerMedia().currentTime;
    remotePlayer.currentTime = currentTime;
    lifecycle.moveToBackground();
  }

  async togglePlayers() {
    const currentState = await lifecycle.getState();
    if (currentState == "background" || currentState == "inTransitionToBackground") {
      this.moveToLocalPlayer();
    } else {
      this.moveToRemotePlayer();
    }
  }
}

export const videoManager = new VideoManager();
