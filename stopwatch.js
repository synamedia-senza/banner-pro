export default class Stopwatch {

  constructor() {
    this.banner = null;
    this.interval = null;
    
    senza.lifecycle.addEventListener("beforestatechange", async (event) => {
      if (event.state === "background") {
        await this.willMoveToBackground();
      } else if (event.state === "suspended" || event.state === undefined) {
        await this.willMoveToSuspended();
      }
    });

    senza.lifecycle.addEventListener("onstatechange", (event) => {
      if (event.state === "background") {
        this.movedToBackground();
      } else if (event.state === "foreground") {
        this.movedToForeground();
      }
    });

    this.createBanner();
    this.restore();
    this.start();
  }

  save() {
    localStorage.setItem("stopwatch/foreground", `${this.foreground}`);
    localStorage.setItem("stopwatch/background", `${this.background}`);
    localStorage.setItem("stopwatch/suspended", `${this.suspended}`);
    localStorage.setItem("stopwatch/backgroundTime", `${this.backgroundTime}`);
    localStorage.setItem("stopwatch/suspendedTime", `${this.suspendedTime}`);
  }

  restore() {
    if (senza.lifecycle.connectReason == senza.lifecycle.ConnectReason.INITIAL_CONNECTION) { 
      this.foreground = 0;
      this.background = 0;
      this.suspended = 0;
      this.backgroundTime = 0;
      this.suspendedTime = 0;
    } else {
      this.foreground = parseInt(localStorage.getItem("stopwatch/foreground")) || 0;
      this.background = parseInt(localStorage.getItem("stopwatch/background")) || 0;
      this.suspended = parseInt(localStorage.getItem("stopwatch/suspended")) || 0;
      this.backgroundTime = parseInt(localStorage.getItem("stopwatch/backgroundTime")) || 0;
      this.suspendedTime = parseInt(localStorage.getItem("stopwatch/suspendedTime")) || 0;
      
      this.accumulate();
    }
  }

  start() {
    this.updateBanner();
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.foreground++;
      this.updateBanner();
      this.save();
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  accumulate() {
    if (this.backgroundTime) {
      if (this.suspendedTime) {
        this.background += Math.ceil((this.suspendedTime - this.backgroundTime) / 1000);
        this.suspended += Math.ceil((Date.now() - this.suspendedTime) / 1000);
      } else {
        let backgroundSecs = 
        this.background += Math.ceil((Date.now() - this.backgroundTime) / 1000);
      }
      
      this.backgroundTime = 0;
      this.suspendedTime = 0;
    }
  }

  async willMoveToBackground() {
    this.banner.style.color = 'red';
    await this.sleep(0.025);
  }

  async willMoveToSuspended() {
    this.suspendedTime = Date.now();
    this.save();
    await this.sleep(0.025);
  }

  movedToForeground() {
    setTimeout(() => this.banner.style.color = 'white', 500);
    this.accumulate();
    this.start();
  }

  movedToBackground() {
    this.banner.style.color = 'red';
    this.backgroundTime = Date.now();
    this.stop();
    this.save();
  }

  createBanner() {
    this.banner = document.createElement('div');
    this.banner.style.position = 'fixed';
    this.banner.style.top = '100px';
    this.banner.style.left = '0';
    this.banner.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    this.banner.style.color = 'white';
    this.banner.style.fontFamily = 'monospace';
    this.banner.style.fontWeight = '500';
    this.banner.style.fontSize = '24px';
    this.banner.style.padding = '22px';
    this.banner.style.display = 'flex';
    this.banner.style.zIndex = '1000';
    document.body.appendChild(this.banner);
  }

  updateBanner() {
    let ratio = this.foreground ? Math.floor(this.foreground /
      (this.foreground + this.background + this.suspended) * 10000) / 100 : 100;
    this.banner.innerHTML =  `Foreground: ${this.formatTime(this.foreground)}<br>`;
    this.banner.innerHTML += `Background: ${this.formatTime(this.background)}<br>`;
    this.banner.innerHTML += `&nbsp;Suspended: ${this.formatTime(this.suspended)}<br>`;
    this.banner.innerHTML += `${'&nbsp;'.repeat(4)} Ratio: ${ratio.toFixed(2)}%`;
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return String(hours) + ':' +
      String(minutes).padStart(2, '0') + ':' +
      String(secs).padStart(2, '0');
  }

  async sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }
}

