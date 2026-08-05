import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL } from '@/lib/constants'

// Service-role client for scheduled (unattended) runs — bypasses RLS, so it
// is ONLY handed to the agent heartbeat routes, never to request handlers
// acting on behalf of a browser session.
export function getServiceClient(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } })
}
