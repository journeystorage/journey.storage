// ─────────────────────────────────────────────────────────────
//  JOURNEY.STORAGE PORTAL — CONFIG
//  Paste your two Supabase keys between the quotes below.
//  (You'll get these in Step 2 of the SETUP-GUIDE.)
// ─────────────────────────────────────────────────────────────

window.JOURNEY_CONFIG = {
  SUPABASE_URL: "https://uwncchrmdotateyditjc.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_1gqMsbBcN6naNPtwlOD_VQ_04C_kizW",

  // ── AI invoice/receipt reading ──────────────────────────────
  // Set USE_AI to true AFTER you upload extract.php (with your AI key)
  // to the same /portal folder. See AI-DOCUMENT-READING.md.
  // It makes reading truly AI-powered (who you're paying + what for).
  // Leave false to use the built-in browser reader.
  USE_AI: true,
  AI_ENDPOINT: "extract.php",

  // ── Google Sheet sync (optional, PULL model) ────────────────
  // The portal drops each invoice/receipt into a private queue on
  // your own server (queue.php). A script attached to your Sheet
  // pulls the queue every minute and writes the rows — running as
  // you, inside your org. See GOOGLE-SHEET-SYNC.md. Set to "" to
  // turn the sync off.
  SHEETS_URL: "queue.php"
};
