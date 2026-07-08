/* ==========================================================================
   gallery.js — Photo + Video gallery
   --------------------------------------------------------------------------
   Browsers cannot list the contents of a local folder for security reasons,
   so this file is the single place you tell the site which files exist.
   Just drop your files into /photos and /videos, then add their filenames
   to the two arrays below. Everything else (masonry layout, lightbox,
   video cards) is generated automatically.
   ========================================================================== */

// EDIT THESE TWO LISTS -------------------------------------------------
const PHOTO_FILES = [
  // "photos/team-lunch.jpg",
  // "photos/sprint-win.png",
  "photos/1.jpg",
  "photos/2.jpg",
  "photos/3.jpg",
  "photos/4.jpg",
  "photos/5.jpg",
  "photos/6.jpg",
  "photos/7.jpg",
  "photos/8.jpg",
  "photos/9.jpg",
  "photos/10.jpg",
  "photos/11.jpg",
  "photos/12.jpg",
  "photos/13.jpg",
  "photos/14.jpg",
  "photos/15.jpg",
  "photos/16.jpg",
  "photos/17.jpg",
];

const VIDEO_FILES = [
  // "videos/farewell-message.mp4",
  "videos/vd3.mp4",
  "videos/vd1.mp4",
  "videos/vd4.mp4",
];
// ------------------------------------------------------------------------

const Gallery = {
  init() {
    this.renderPhotos();
    this.renderVideos();
    this.bindLightbox();
  },

  renderPhotos() {
    const wrap = document.getElementById("photo-masonry");
    if (!wrap) return;

    if (PHOTO_FILES.length === 0) {
      wrap.innerHTML = `
        <div class="gallery-empty">
          📸 No photos yet.<br /><br />
          Drop image files into <code>/photos</code> and list their filenames
          inside <code>PHOTO_FILES</code> at the top of <code>js/gallery.js</code>.
        </div>`;
      return;
    }

    wrap.innerHTML = PHOTO_FILES.map((src, i) => `
      <div class="masonry-item" data-index="${i}">
        <img src="${src}" alt="Memory ${i + 1}" loading="lazy" onerror="this.closest('.masonry-item').remove()" />
      </div>
    `).join("");
  },

  renderVideos() {
    const wrap = document.getElementById("video-grid");
    if (!wrap) return;

    if (VIDEO_FILES.length === 0) {
      wrap.innerHTML = `
        <div class="gallery-empty">
          🎬 No videos yet.<br /><br />
          Drop video files into <code>/videos</code> and list their filenames
          inside <code>VIDEO_FILES</code> at the top of <code>js/gallery.js</code>.
        </div>`;
      return;
    }

    wrap.innerHTML = VIDEO_FILES.map((src) => `
      <div class="video-card">
        <video src="${src}" controls preload="metadata"></video>
      </div>
    `).join("");
  },

  bindLightbox() {
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("lightbox-close");

    document.getElementById("photo-masonry")?.addEventListener("click", (e) => {
      const item = e.target.closest(".masonry-item img");
      if (!item) return;
      img.src = item.src;
      lightbox.classList.add("active");
    });

    const close = () => lightbox.classList.remove("active");
    closeBtn?.addEventListener("click", close);
    lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  },
};
