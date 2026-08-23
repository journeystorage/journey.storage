// ─────────────────────────────────────────────────────────────
//  JOURNEY.STORAGE — ACCOUNTING INTAKE — CONFIG (TEMPLATE)
//
//  Copy this file to config.js and fill in the values below.
//  config.js is gitignored: it holds a live write endpoint.
//  See GOOGLE-SHEETS-SETUP.md for how to get the Web App URL.
// ─────────────────────────────────────────────────────────────

window.JOURNEY_CONFIG = {
  // Apps Script Web App deployment URL. Ends in /exec.
  // Deploy → New deployment → Web app (Execute as: Me).
  SHEETS_WEBAPP_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",

  // ── AI invoice/receipt reading (optional) ───────────────────
  // Off by default — there's no server-side extract.php for this app
  // yet, so it runs on the built-in browser reader (PDF text + regex)
  // until you stand up an AI endpoint and flip this on.
  USE_AI: false,
  AI_ENDPOINT: "extract.php"
};
