# Operation: Save Praty 👑

A premium, interactive farewell website for **Praty Poondla** — Associate Director,
Chief Believer in People. Built with plain HTML, CSS and vanilla JavaScript
(plus GSAP and canvas-confetti from a CDN for the polish).

Just open **`index.html`** in any modern browser. No build step, no install.

---

## Folder structure

```
Farewell-Praty/
├── index.html          # all screens/sections live here
├── style.css            # dark premium theme (navy / royal blue / purple / gold)
├── js/
│   ├── script.js         # main controller: boot, quiz, leaving page, crown, achievements, final page
│   ├── gallery.js         # photo + video gallery (masonry + lightbox)
│   ├── news.js            # breaking news ticker content
│   ├── timeline.js        # memory timeline milestones
│   └── easter-eggs.js     # konami code, 7x name click, fake windows update
├── photos/               # put your photo files here
├── videos/                # put your video files here
├── assets/                # optional extra images (logo, icons)
└── README.md
```

## Adding your own photos & videos

Browsers can't read the contents of a folder for security reasons, so you
list your filenames once and the gallery builds itself from there:

1. Drop image files into `/photos` and video files into `/videos`.
2. Open `js/gallery.js` and add the filenames to `PHOTO_FILES` / `VIDEO_FILES`:

```js
const PHOTO_FILES = [
  "photos/team-lunch.jpg",
  "photos/sprint-win.png",
];

const VIDEO_FILES = [
  "videos/farewell-message.mp4",
];
```

That's it — the masonry gallery, lightbox, and video cards render automatically.

## Customizing content

Everything is data-driven near the top of each JS file, so you don't need to
touch the layout code to change the words:

| What to edit | Where |
|---|---|
| Boot terminal lines | `Boot.lines` in `js/script.js` |
| Quiz questions | `Quiz.questions` in `js/script.js` |
| "Leave" button taunts | `Leaving.taunts` in `js/script.js` |
| Hall of Fame cards | `FAME_ITEMS` in `js/script.js` |
| Roast cards | `ROAST_ITEMS` in `js/script.js` |
| Appreciation wall notes | `WALL_MESSAGES` in `js/script.js` |
| Final farewell paragraph | `Final.lines` in `js/script.js` |
| Breaking news ticker | `NEWS_TICKER_ITEMS` in `js/news.js` |
| Timeline milestones | `MILESTONES` in `js/timeline.js` |

## Easter eggs

- Click **Praty's name** on the dossier card 7 times → crown rain 👑
- **Konami code** (`↑ ↑ ↓ ↓ ← → ← → B A`) → "Developer Mode" secret message
- Type the word **`update`** anywhere on the page → fake "Installing New Manager…" prank that fails

## Design notes

The visual signature is the glowing **HUD scan-frame** (gold corner brackets +
moving scanline) used on the boot terminal, employee dossier, crown award and
achievement toasts — it ties the whole "top-secret investigation" narrative
together. Palette: navy background, royal-blue-to-purple gradients for
primary actions, gold for anything "trophy" or "crown" related.

## Deploying to Vercel

This is a static site (no build step, no server code), so Vercel deploys it as-is.

**Option A — Vercel dashboard (no CLI needed)**
1. Push this folder to a GitHub repo (or drag-and-drop the folder into the Vercel dashboard's "Add New Project" screen).
2. Import the repo in [vercel.com/new](https://vercel.com/new).
3. Framework preset: choose **"Other"** (it's plain static HTML, no framework needed).
4. Leave build command empty and output directory as `.` (root) — Vercel will just serve `index.html`.
5. Deploy.

**Option B — Vercel CLI**
```bash
npm i -g vercel
cd Farewell-Praty
vercel
```
Follow the prompts (accept defaults — no build command needed) and it'll give you a live URL.

A tiny `vercel.json` is included in this folder for clean static-site defaults; you don't need to touch it.

## Tech

- Vanilla HTML/CSS/JS — no build tools, no frameworks
- [GSAP](https://gsap.com/) (CDN) for a few polish animations
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) (CDN) for the final confetti burst
- Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (terminal/HUD text) via Google Fonts

Everything runs entirely client-side — nothing is uploaded anywhere.

---

Made with 💛 by the QA team, for the manager who made it feel like family.
