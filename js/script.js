/* ==========================================================================
   script.js — Operation Save Praty
   Main controller: boot sequence, screen state machine, quiz, leaving-page
   chase, crown reveal, hall of fame / roast data, achievements, final page.
   Depends on: gallery.js, news.js, easter-eggs.js (loaded first)
   ========================================================================== */

/* -------------------- Screen order & navigation -------------------- */
const SCREEN_ORDER = [
  "screen-boot", "screen-quiz", "screen-loading", "screen-leaving",
  "screen-news", "screen-crown", "screen-fame", "screen-roast",
  "screen-gallery", "screen-videos",
  "screen-final",
];

const AppState = {
  current: "screen-boot",

  goTo(id) {
    const from = document.getElementById(this.current);
    const to = document.getElementById(id);
    if (!to) return;
    if (from) { from.classList.remove("active", "fade-in"); }
    to.classList.add("active");
    // force reflow so the animation replays
    void to.offsetWidth;
    to.classList.add("fade-in");
    this.current = id;
    Nav.highlight(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
};
window.AppState = AppState;

/* -------------------- Top nav -------------------- */
const Nav = {
  build() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    nav.innerHTML = SCREEN_ORDER.map((id) => {
      const label = document.getElementById(id)?.dataset.title || id;
      return `<button data-target="${id}">${label}</button>`;
    }).join("");
    nav.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-target]");
      if (btn) AppState.goTo(btn.dataset.target);
    });
  },
  reveal() { document.getElementById("site-nav")?.classList.remove("hidden"); },
  highlight(id) {
    document.querySelectorAll("#site-nav button").forEach((b) => {
      b.classList.toggle("current", b.dataset.target === id);
    });
    const idx = SCREEN_ORDER.indexOf(id) + 1;
    const hint = document.getElementById("progress-hint");
    if (hint) hint.textContent = `${idx} / ${SCREEN_ORDER.length}`;
  },
};

/* ==========================================================================
   1. BOOT SEQUENCE
   ========================================================================== */
const Boot = {
  lines: [
    "Connecting to QA Headquarters test environment…",
    "Verifying tester clearance…",
    "Access granted. Environment: PRODUCTION-CRITICAL.",
    "Loading test suite: retain_best_manager.spec.js…",
    "Scanning employee database for regressions…",
  ],

  async run() {
    const linesEl = document.getElementById("boot-lines");
    const bar = document.getElementById("boot-bar");
    const status = document.getElementById("boot-status");

    for (const line of this.lines) {
      const p = document.createElement("div");
      p.className = "boot-line";
      linesEl.appendChild(p);
      await this.typeInto(p, line);
      await wait(180);
    }

    status.innerHTML = "Running test suite… <span class='boot-cursor'></span>";
    for (let pct = 0; pct <= 100; pct += 4) {
      bar.style.width = pct + "%";
      await wait(28);
    }
    status.innerHTML = "<span class='ok'>Test Subject Found. 0 bugs. 0 regrets.</span>";
    await wait(500);

    document.getElementById("boot-terminal").style.display = "none";
    const dossier = document.getElementById("dossier");
    dossier.style.display = "block";
    gsap?.from(dossier, { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" });
  },

  typeInto(el, text) {
    return new Promise((resolve) => {
      let i = 0;
      const id = setInterval(() => {
        el.textContent = text.slice(0, i + 1);
        i++;
        if (i >= text.length) { clearInterval(id); resolve(); }
      }, 16);
    });
  },
};

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ==========================================================================
   2. QUESTION ROUND
   ========================================================================== */
const Quiz = {
  questions: [
    { q: "Who built one of the strongest QA teams?", options: ["Google", "ChatGPT", "Luck", "Praty"] },
    { q: "Who somehow knew everyone's strengths better than they did?", options: ["A personality test", "Praty", "The org chart", "Google Forms"] },
    { q: "Who believed in us before we believed in ourselves?", options: ["Praty", "Nobody", "A motivational poster", "The IT helpdesk"] },
  ],
  wrongQuotes: [
    "Failed: expected 'Praty', received nonsense.",
    "QA flags this as a false positive. Try again.",
    "That answer didn't pass code review.",
    "Regression detected in your logic.",
    "404: Correct answer not found here.",
    "Close, but the test suite disagrees.",
    "Nice guess. Still not it.",
    "Rejected by the review board.",
  ],
  index: 0,

  init() {
    this.index = 0;
    this.render();
  },

  render() {
    const q = this.questions[this.index];
    document.getElementById("quiz-progress").textContent = `TEST CASE ${this.index + 1} / ${this.questions.length}`;
    document.getElementById("quiz-question").textContent = q.q;
    const feedback = document.getElementById("quiz-feedback");
    feedback.classList.remove("show", "show-wrong");
    feedback.textContent = "Assertion Passed.";

    const optionsEl = document.getElementById("quiz-options");
    optionsEl.innerHTML = q.options.map((opt) => `<button class="quiz-option">${opt}</button>`).join("");
    optionsEl.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => this.answer(btn));
    });
  },

  answer(btn) {
    const feedback = document.getElementById("quiz-feedback");
    const isCorrect = btn.textContent.trim() === "Praty";

    if (!isCorrect) {
      // Wrong pick: funny rejection, button disabled, question stays open so
      // the user has to land on "Praty" to move on.
      btn.classList.add("wrong");
      btn.disabled = true;
      const quote = this.wrongQuotes[Math.floor(Math.random() * this.wrongQuotes.length)];
      feedback.textContent = quote;
      feedback.classList.remove("show-correct");
      feedback.classList.add("show", "show-wrong");
      return;
    }

    // Correct pick: lock the round and advance.
    document.querySelectorAll(".quiz-option").forEach((b) => (b.disabled = true));
    btn.classList.add("correct");
    feedback.textContent = "Assertion Passed. Expected: Praty. Received: Praty.";
    feedback.classList.remove("show-wrong");
    feedback.classList.add("show", "show-correct");

    setTimeout(() => {
      this.index++;
      if (this.index < this.questions.length) {
        this.render();
      } else {
        AppState.goTo("screen-loading");
        Loading.run();
      }
    }, 1100);
  },
};

/* ==========================================================================
   3. FUNNY LOADING SCREEN
   ========================================================================== */
const Loading = {
  async run() {
    document.getElementById("load-error").classList.remove("show");
    await this.fill("load-1", 900);
    await this.fill("load-2", 1000);
    await this.fill("load-3", 1200);
    await wait(300);
    document.getElementById("load-error").classList.add("show");
  },
  fill(id, duration) {
    return new Promise((resolve) => {
      const el = document.getElementById(id);
      el.style.transitionDuration = duration + "ms";
      requestAnimationFrame(() => { el.style.width = "100%"; });
      setTimeout(resolve, duration);
    });
  },
};

/* ==========================================================================
   4. LEAVING PAGE — the fleeing button
   ========================================================================== */
const Leaving = {
  taunts: [
    "Nice try.", "QA rejected this request.", "Manager approval required.",
    "Sprint still active.", "Deployment failed.", "Access denied.",
    "HR rejected your resignation.", "You cannot escape.",
    "Test case blocked: reason field is empty.", "Regression detected. Rolling back.",
    "This ticket was auto-reopened.", "Environment locked for testing.",
  ],
  attempts: 0,
  maxAttempts: 8,

  init() {
    this.attempts = 0;
    const btn = document.getElementById("leave-btn");
    const wrap = document.querySelector(".leaving-buttons");
    btn.style.position = "fixed";
    btn.style.left = "";
    btn.style.top = "";

    // Reset position relative to its normal flow initially by measuring.
    const resetPos = () => {
      const rect = btn.getBoundingClientRect();
      btn.dataset.x = rect.left;
      btn.dataset.y = rect.top;
    };
    setTimeout(resetPos, 50);

    wrap.onmousemove = (e) => this.handleMove(e, btn);
    wrap.ontouchstart = (e) => this.handleMove(e.touches[0], btn);

    btn.onclick = (e) => {
      if (this.attempts < this.maxAttempts) {
        e.preventDefault();
        this.flee(btn);
      } else {
        this.proceed();
      }
    };

    document.getElementById("stay-btn").onclick = () => this.proceed();
  },

  handleMove(e, btn) {
    if (this.attempts >= this.maxAttempts) return;
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 140) this.flee(btn);
  },

  flee(btn) {
    this.attempts++;
    const wrapRect = document.querySelector(".leaving-buttons").getBoundingClientRect();
    const maxX = window.innerWidth - 160;
    const maxY = window.innerHeight - 80;
    const newX = Math.max(20, Math.random() * maxX);
    const newY = Math.max(80, Math.random() * maxY);
    btn.style.left = newX + "px";
    btn.style.top = newY + "px";

    this.showTaunt();

    if (this.attempts >= this.maxAttempts) {
      btn.textContent = "💔 Leave (fine, click again)";
      btn.style.position = "static";
      btn.style.left = "";
      btn.style.top = "";
    }
  },

  showTaunt() {
    const el = document.getElementById("taunt-message");
    const msg = this.taunts[Math.floor(Math.random() * this.taunts.length)];
    el.textContent = msg;
    el.style.left = Math.random() * 60 + 20 + "vw";
    el.style.top = Math.random() * 50 + 25 + "vh";
    el.classList.add("show");
    clearTimeout(this._t);
    this._t = setTimeout(() => el.classList.remove("show"), 900);
  },

  proceed() {
    AppState.goTo("screen-news");
    Achievements.unlock("🕵️", "Escape Artist Denied");
  },
};

/* ==========================================================================
   5. CROWN SEQUENCE
   ========================================================================== */
const Crown = {
  async run() {
    const search = document.getElementById("crown-search");
    const messages = [
      "Searching test leads for a replacement…", "Searching…", "Searching…",
      "ERROR", "No Suitable Candidate Found.", "Test Lead Transfer Failed.",
    ];
    for (const m of messages) {
      search.textContent = m;
      await wait(650);
    }
    await wait(300);
    document.getElementById("crown-award").style.display = "block";
    gsap?.from("#crown-award", { opacity: 0, scale: 0.92, duration: 0.6, ease: "back.out(1.6)" });
    Achievements.unlock("👑", "Crown Rightfully Unclaimed");
  },
};

/* ==========================================================================
   6. HALL OF FAME + ROAST — flip card data
   ========================================================================== */
const FAME_ITEMS = [
  { icon: "🚑", title: "Sprint Saver", back: "Rescued more sprints than most people rescue emails from spam." },
  { icon: "☕", title: "Coffee Powered Leader", back: "Runs on caffeine and an unreasonable amount of optimism." },
  { icon: "🐞", title: "Bug Destroyer", back: "Bugs fear her. QA respects her. Devs quietly hope she's on their release." },
  { icon: "🧙", title: "Task Assignment Wizard", back: "Knows exactly who should own what before the meeting even starts." },
  { icon: "👑", title: "Queen of QA", back: "The crown was never really up for grabs." },
  { icon: "🤝", title: "Chief Believer in People", back: "Saw potential in people before they saw it in themselves." },
  { icon: "🔥", title: "Production Firefighter", back: "Calm in the middle of a P1 like it's a Tuesday standup." },
  { icon: "🧠", title: "Mind Reader", back: "Somehow knows you're stuck before you even Slack her." },
  { icon: "🦸", title: "Support Superhero", back: "No cape. Just really, really good at showing up." },
];

const ROAST_ITEMS = [
  { icon: "📩", title: "Speed Reader", back: "Probably answered your message before you finished reading it." },
  { icon: "🛰️", title: "Long-Range Detector", back: "Can sense a QA blocker from another continent." },
  { icon: "🧬", title: "Suspiciously Everywhere", back: "We're 80% sure she secretly owns ten clones." },
  { icon: "🌀", title: "Meeting Inception", back: "Runs one meeting while attending another. Simultaneously." },
  { icon: "☕", title: "80% Coffee", back: "Blood type: mostly espresso." },
];

const FlipCards = {
  render(gridId, items) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = items.map((it) => `
      <div class="flip-card">
        <div class="flip-inner">
          <div class="flip-face flip-front"><div class="icon">${it.icon}</div><h4>${it.title}</h4></div>
          <div class="flip-face flip-back">${it.back}</div>
        </div>
      </div>
    `).join("");
  },
};

/* ==========================================================================
   7. APPRECIATION WALL
   ========================================================================== */
const WALL_MESSAGES = [
  "Thank you for every word of encouragement, and for believing in me. You'll always be my favorite manager.",
  "Thank you so much for all you have done for me! You will shine wherever you go! Enjoy your next challenge! You will be missed!",
  "All the best Praty – May your journey continue to be filled with exciting challenges and great achievements!",
  "Thank you for your support & guidance.Wishing you continued success in your career.👍❤️",
  "Thank you for being such an inspiring leader, an incredible mentor, and someone who always made our team feel like a family. Your guidance, support, and care have meant a lot to all of us. You will truly be missed. Wishing you continued success, happiness, and all the very best in your new opportunity and future endeavors!",
  "Dearest Praty,Thank you for giving me an opportunity when I had no skills to prove I deserved one, and giving me a direction when I was lost. Your belief in me changed everything.If my career is ever a book, you'll always be my introduction — the page that made everything after it possible...You're my leader, my mentor, my guide, and my friend.Wishing you all the best for your future adventures...you deserve every bit of happiness and success ahead.Thank you, from the bottom of my heart 🩷.",
  "Hi Praty, my learnings under you are precious and will never be forgotten, Thanks for everything. I wish you all the luck!!",
  "Thank you for making a difference in our lives, not just our careers. You'll always be part of my success.",
  "Thank you for everything Praty!!! You've left a bigger impact than you probably realize and you'll definitely be missed. Wishing you nothing but the best for the future!",
  "Wishing you all the very best, Praty. I feel lucky to have worked with you. Your trust, support, and encouragement have meant a lot to me, especially during times I doubted myself. You are not only a great manager and leader, but also a wonderful human being. Thank you for everything. We will truly miss you! Continue inspiring many more.",
  "Thank you, Praty, for being an amazing leader and an even better person. Your support, encouragement, and care have made a lasting difference in our lives. Wishing you success, happiness, and fulfillment in everything you do. You'll be missed, but never forgotten. All the very best for your next chapter!",
  "Thank you so much Praty for your guidance and support in helping us to grow. All the best in your new role and keep rocking as always. Looking forward to working with you again in the future",
  "A great manager leads a team, but a great leader earns their team's respect. You have done both. I have always admired how you stood by your team, remained fair in every situation, and addressed issues directly with the right people. Wishing you all the best for the future Praty!",
  "Thank you for your mentorship and unwavering support. Wishing you every success in your new journey—you'll be greatly missed!",
  "Praty, it’s been great working with you. Thanks for all the support, laughs, and memories. Wishing you all the success and happiness in your next chapter. We’ll definitely miss you—good luck and all the best!",
  "Dear Praty, You are such an incredible leader and mentor. Working with you has been one of the most rewarding experiences of my career. Your guidance, trust, and influence will continue to shape the way we work, collaborate, and grow. Wishing you all the very best in your next chapter. Once a part of Praty's team, always a part of it. Thank you for everything.",
  "We'll miss you, Praty. Thank you for believing in me and giving me this opportunity. Your trust and confidence in me have meant more than words can express, and I'll always be grateful for the chance you gave me. Wishing you all the happiness and success in your next journey. Thank you for everything!",
];
const NOTE_COLORS = ["#ffe066", "#a0e7e5", "#ffb3c6", "#c3f584", "#ffd6a5", "#bdb2ff"];

const Wall = {
  render() {
    const grid = document.getElementById("wall-grid");
    if (!grid) return;
    grid.innerHTML = WALL_MESSAGES.map((msg, i) => {
      const color = NOTE_COLORS[i % NOTE_COLORS.length];
      const rot = (Math.random() * 10 - 5).toFixed(1);
      return `
        <div class="sticky-note" style="background:${color}; transform: rotate(${rot}deg);" data-index="${i}">
          <div class="sticky-inner">
            <div class="sticky-front">Click to reveal 💌</div>
            <div class="sticky-back">${msg}</div>
          </div>
        </div>`;
    }).join("");

    grid.querySelectorAll(".sticky-note").forEach((note) => {
      note.addEventListener("click", () => note.classList.toggle("flipped"));
    });
  },
};

/* ==========================================================================
   8. ACHIEVEMENTS
   ========================================================================== */
const Achievements = {
  pool: [
    ["🏆", "Sprint Saver"], ["🎓", "Best Mentor"], ["💪", "Built Confidence"],
    ["🦸", "QA Hero"], ["🤝", "People First Leader"], ["🐞", "Zero Escaped Defects"],
    ["✅", "100% Test Coverage on Trust"],
  ],
  unlock(icon, name) {
    const toast = document.getElementById("achievement-toast");
    document.getElementById("ach-icon").textContent = icon;
    document.getElementById("ach-name").textContent = name;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  },
  startRandomPopups() {
    setInterval(() => {
      const [icon, name] = this.pool[Math.floor(Math.random() * this.pool.length)];
      this.unlock(icon, name);
    }, 26000);
  },
};

/* ==========================================================================
   9. FINAL PAGE
   ========================================================================== */
const Final = {
  lines: [
    "Every sprint ends.",
    "Every release ships.",
    "Every project eventually closes.",
    "But great leaders never really leave.",
    "Because pieces of them stay with every person they helped grow.",
    "",
    "Thank you, Praty —",
    "for believing in us, supporting us, challenging us,",
    "laughing with us, and building a team that feels like family.",
    "",
    "We will always carry a little bit of your leadership with us. ❤️",
  ],

  render() {
    const el = document.getElementById("final-text");
    el.innerHTML = this.lines.map((l, i) =>
      `<span class="line" style="animation-delay:${i * 0.35}s">${l || "&nbsp;"}</span>`
    ).join("") + `<span class="line" style="animation-delay:${this.lines.length * 0.35}s; display:block; margin-top:18px; font-family:var(--font-mono); font-size:0.85rem; color:var(--success);">✓ Test Suite: PASSED — Praty: Irreplaceable</span>`;

    setTimeout(() => this.confettiBurst(), (this.lines.length + 1) * 350 + 300);
  },

  confettiBurst() {
    if (typeof confetti !== "function") return;
    const duration = 2500;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0 }, colors: ["#f5b942", "#7c3aed", "#2563eb"] });
      confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1 }, colors: ["#f5b942", "#7c3aed", "#2563eb"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 160, spread: 100, origin: { y: 0.5 } });
  },
};

/* ==========================================================================
   10. FINAL EXIT JOKE
   ========================================================================== */
const ExitJoke = {
  bind() {
    document.getElementById("final-exit-btn")?.addEventListener("click", () => {
      const sure = confirm("Are you sure?\n\nThe QA Team isn't.");
      if (sure) {
        alert("HAHA! We knew you'd stay a little longer. 💛");
      } else {
        alert("Smart choice. Nobody's going anywhere. 💛");
      }
    });
  },
};

/* ==========================================================================
   11. Ambient background — floating stars / particles (canvas)
   ========================================================================== */
const Particles = {
  init() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, stars;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.15 + 0.03,
      twinkle: Math.random() * Math.PI * 2,
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.twinkle += 0.02;
        const alpha = 0.4 + Math.sin(s.twinkle) * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        s.y += s.speed;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      }
      requestAnimationFrame(draw);
    }
    draw();
  },
};

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  Particles.init();
  Nav.build();

  Gallery.init();
  News.init();
  EasterEggs.init();
  Wall.render();
  FlipCards.render("fame-grid", FAME_ITEMS);
  FlipCards.render("roast-grid", ROAST_ITEMS);
  Final.render();
  ExitJoke.bind();
  Achievements.startRandomPopups();

  // Boot sequence, then reveal nav
  Boot.run().then(() => Nav.reveal());

  // Wire up buttons that move between screens
  document.getElementById("begin-investigation-btn").addEventListener("click", () => {
    AppState.goTo("screen-quiz");
    Quiz.init();
  });
  document.getElementById("loading-continue-btn").addEventListener("click", () => {
    AppState.goTo("screen-leaving");
    Leaving.init();
  });
  document.getElementById("news-continue-btn").addEventListener("click", () => {
    AppState.goTo("screen-crown");
    Crown.run();
  });
  document.getElementById("crown-continue-btn").addEventListener("click", () => AppState.goTo("screen-fame"));
  document.getElementById("fame-continue-btn").addEventListener("click", () => AppState.goTo("screen-roast"));
  document.getElementById("roast-continue-btn").addEventListener("click", () => AppState.goTo("screen-gallery"));
  document.getElementById("gallery-continue-btn").addEventListener("click", () => AppState.goTo("screen-videos"));
  document.getElementById("videos-continue-btn").addEventListener("click", () => AppState.goTo("screen-final"));
  //document.getElementById("wall-continue-btn").addEventListener("click", () => AppState.goTo("screen-final"));
});
