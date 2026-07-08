/* ==========================================================================
   news.js — Breaking News ticker
   ========================================================================== */

const NEWS_TICKER_ITEMS = [
  "Scientists searching for replacement… 0 Results Found.",
  "Coffee consumption expected to rise 400%.",
  "QA morale expected to decrease.",
  "Bug count expected to increase.",
  "Management currently panicking.",
  "Sources confirm: nobody explains Jira tickets like her.",
  "Breaking: replacement manager still 'searching for candidate'.",
];

const News = {
  init() {
    const ticker = document.getElementById("news-ticker");
    if (!ticker) return;
    // Duplicate the list so the CSS marquee loop is seamless.
    const items = [...NEWS_TICKER_ITEMS, ...NEWS_TICKER_ITEMS]
      .map((t) => `<span>📢 ${t}</span>`)
      .join("");
    ticker.innerHTML = items;
  },
};
