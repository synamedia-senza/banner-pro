import { remotePlayer, lifecycle } from "senza-sdk";

class VideoManager {

  init(media, player) {
    this.media = media;
    this.localPlayer = player;
    this.remotePlayer = remotePlayer;
 
    remotePlayer.registerVideoElement(this.media);

    remotePlayer.addEventListener("timeupdate", () => {
      this.media.currentTime = remotePlayer.currentTime || 0;
    });

    remotePlayer.addEventListener("ended", () => {
      lifecycle.moveToForeground();
    });

    lifecycle.addEventListener("onstatechange", (event) => {
      if (event.state === "background") {
        this.pause();
      } else if (event.state === "foreground") {
        this.play();
      }
    });
  }

  async load(url) {
    await this.localPlayer.load(url);
    try {
      await remotePlayer.load(url, 0);
    } catch (error) {
      console.log("Couldn't load remote player.");
    }
  }
  
  play() {
    this.media.play().catch(error => {
      console.log("Unable to play video. Possibly the browser will not autoplay video with sound.");
    });
    remotePlayer.play(false);
  }
  
  pause() {
    this.media.pause();
    remotePlayer.pause();
  }
  
  playPause() {
    if (this.media.paused) {
      this.play();
    } else {
      this.pause();
    }
  }
  
  skip(seconds) {
    let newTime = this.media.currentTime + seconds;
    this.media.currentTime = newTime;
    remotePlayer.currentTime = newTime;
  }

  moveToForeground() {
    lifecycle.moveToForeground();
  }

  moveToBackground() {
    // let currentTime = this.media.currentTime;
    // remotePlayer.currentTime = currentTime;
    // remotePlayer.play();
    lifecycle.moveToBackground();
  }
  
  async toggleBackground() {
    const currentState = await lifecycle.getState();
    if (currentState == "background" || currentState == "inTransitionToBackground") {
      lifecycle.moveToForeground();
    } else {
      this.moveToBackground();
    }
  }
}

export const videoManager = new VideoManager();