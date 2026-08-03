// Two-person allowlist — the Hub now covers what the standalone investors
// CRM used to (lyvia + jonah), so it inherits that same allowlist rather
// than staying single-user.
export const HUB_ALLOWED_EMAILS = ['lyvia@journey.storage', 'jonah@journey.storage']

// Same Supabase project the rest of journey.storage uses (see apps/portal/config.js).
// The anon/publishable key is safe to ship to the browser by design — every
// table it can touch is locked down by RLS to HUB_ALLOWED_EMAILS (see
// supabase/hub_setup.sql). Overridable via env for future project moves.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://uwncchrmdotateyditjc.supabase.co'
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_1gqMsbBcN6naNPtwlOD_VQ_04C_kizW'
