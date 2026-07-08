/* ==========================================================================
   easter-eggs.js
   1) Click Praty's name 7 times  -> crown rain
   2) Konami code (↑↑↓↓←→←→BA)    -> "Developer Mode" overlay
   3) Type the word "update"       -> fake Windows-update prank
   ========================================================================== */

const EasterEggs = {
  nameClicks: 0,
  konamiIndex: 0,
  konamiSeq: ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],
  typedBuffer: "",

  init() {
    this.bindNameClicks();
    this.bindKonami();
    this.bindTypedWord();
    this.bindDevModeClose();
  },

  bindNameClicks() {
    const name = document.getElementById("praty-name-click");
    if (!name) return;
    name.style.cursor = "pointer";
    name.addEventListener("click", () => {
      this.nameClicks++;
      if (this.nameClicks >= 7) {
        this.nameClicks = 0;
        this.dropCrowns();
      }
    });
  },

  dropCrowns() {
    for (let i = 0; i < 24; i++) {
      const el = document.createElement("div");
      el.className = "crown-drop";
      el.textContent = "👑";
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDelay = (Math.random() * 0.6) + "s";
      el.style.fontSize = (16 + Math.random() * 22) + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }
  },

  bindKonami() {
    window.addEventListener("keydown", (e) => {
      const expected = this.konamiSeq[this.konamiIndex];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSeq.length) {
          this.konamiIndex = 0;
          this.openDevMode();
        }
      } else {
        this.konamiIndex = key === this.konamiSeq[0] ? 1 : 0;
      }
    });
  },

  openDevMode() {
    document.getElementById("dev-mode-overlay")?.classList.add("active");
  },

  bindDevModeClose() {
    document.getElementById("dev-mode-close")?.addEventListener("click", () => {
      document.getElementById("dev-mode-overlay")?.classList.remove("active");
    });
  },

  bindTypedWord() {
    window.addEventListener("keydown", (e) => {
      if (e.key.length !== 1) return;
      this.typedBuffer = (this.typedBuffer + e.key).slice(-6).toLowerCase();
      if (this.typedBuffer === "update") {
        this.runFakeWindowsUpdate();
      }
    });
  },

  runFakeWindowsUpdate() {
    const overlay = document.getElementById("win-update-overlay");
    const pctEl = document.getElementById("win-update-pct");
    if (!overlay || !pctEl) return;
    overlay.classList.add("active");
    let pct = 1;
    pctEl.textContent = pct + "%";
    const interval = setInterval(() => {
      pct += Math.random() * 6;
      if (pct >= 42 && pct < 100) {
        pctEl.textContent = "Searching…";
      }
      if (pct >= 100) {
        clearInterval(interval);
        pctEl.textContent = "Failed. No Match Found.";
        setTimeout(() => overlay.classList.remove("active"), 2200);
      } else {
        pctEl.textContent = Math.floor(pct) + "%";
      }
    }, 260);
  },
};
