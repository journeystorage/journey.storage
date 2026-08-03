import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/constants'

// Server Components / Route Handlers. Uses the requester's own session (via
// cookies) rather than a service-role key — every query still goes through
// RLS, scoped to whichever user is signed in (see supabase/hub_setup.sql).
export async function getSupabaseServer() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Called from a Server Component that can't set cookies — safe to
          // ignore because middleware already refreshes the session on every request.
        }
      },
    },
  })
}
