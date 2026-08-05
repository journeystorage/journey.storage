import { getSupabaseServer } from '@/lib/supabase-server'
import { getGoogleOAuthConfig, getUserEmail, GOOGLE_SCOPES } from '@/lib/google'

export const runtime = 'nodejs'

// Google redirects here after consent. Exchanges the code for tokens and
// stores them against the signed-in hub user, then bounces to /connections.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const config = getGoogleOAuthConfig()

  if (!config || !code) {
    return Response.redirect(new URL('/connections?google=error', url.origin), 302)
  }

  const supabase = await getSupabaseServer()
  const userEmail = await getUserEmail(supabase)
  if (!userEmail) {
    return Response.redirect(new URL('/login', url.origin), 302)
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    }),
  })

  if (!tokenRes.ok) {
    return Response.redirect(new URL('/connections?google=error', url.origin), 302)
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
  }

  if (!tokens.refresh_token) {
    // Shouldn't happen with prompt=consent, but don't store a half-connection.
    return Response.redirect(new URL('/connections?google=error', url.origin), 302)
  }

  const { error } = await supabase.from('hub_google_tokens').upsert({
    user_email: userEmail,
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    scopes: GOOGLE_SCOPES,
    updated_at: new Date().toISOString(),
  })

  return Response.redirect(
    new URL(`/connections?google=${error ? 'error' : 'connected'}`, url.origin),
    302,
  )
}
