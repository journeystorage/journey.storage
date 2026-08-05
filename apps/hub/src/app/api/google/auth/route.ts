import { getGoogleOAuthConfig, GOOGLE_SCOPES } from '@/lib/google'

export const runtime = 'nodejs'

// Kicks off the Google OAuth consent flow. Proxy already gates /api/* to
// signed-in users, so only lyvia/jonah can ever reach this.
export function GET() {
  const config = getGoogleOAuthConfig()
  if (!config) {
    return Response.json(
      { error: 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env.local' },
      { status: 500 },
    )
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPES.join(' '),
    access_type: 'offline', // gets us a refresh_token
    prompt: 'consent', // forces refresh_token even on re-connect
  })

  return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 302)
}
