// One-time Google grant for the Accounting Intake portal (/portal).
//
//   node scripts/portal-google-auth.mjs <client-id> <client-secret>
//
// Opens Google's consent screen; sign in with the journey.storage account
// that owns the "Accounting Intake — Submissions" sheet and the "Accounting
// Intake Files" folder. The script then checks it can read the sheet and
// writes GOOGLE_OAUTH_CLIENT_ID / _SECRET / _REFRESH_TOKEN into .env.local.
// The token is never printed. Copy those three values into the main site's
// Hostinger environment variables. See src/lib/portal/google.ts.

import http from 'node:http'
import { execFile } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const [clientId, clientSecret] = process.argv.slice(2)
if (!clientId || !clientSecret) {
  console.error('Usage: node scripts/portal-google-auth.mjs <client-id> <client-secret>')
  process.exit(1)
}

const SHEET_ID = '159MK2lb0Dgp8qgYiS8AaYIUbpJtc8PW9rHg6nNXcTh0'
const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets']

const server = http.createServer()
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const redirectUri = `http://127.0.0.1:${server.address().port}`

const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: SCOPES.join(' '),
  access_type: 'offline',
  prompt: 'consent',
})

const code = await new Promise((resolve, reject) => {
  server.on('request', (req, res) => {
    const url = new URL(req.url, redirectUri)
    const got = url.searchParams.get('code')
    const err = url.searchParams.get('error')
    if (!got && !err) { res.writeHead(404).end(); return }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(got ? '<p style="font:16px system-ui">Done. You can close this tab and go back to the terminal.</p>'
                : `<p style="font:16px system-ui">Google said: ${err}</p>`)
    server.close()
    got ? resolve(got) : reject(new Error(`Consent failed: ${err}`))
  })
  console.log('Opening Google sign-in in your browser. If it does not open, visit:\n\n' + authUrl + '\n')
  execFile('open', [authUrl], () => {})
})

const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: 'authorization_code' }),
})
const tokens = await tokenRes.json()
if (!tokens.refresh_token) {
  console.error('Google did not return a refresh token:', tokens.error_description || tokens.error || tokenRes.status)
  process.exit(1)
}

const check = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent('Submissions!1:1')}`, {
  headers: { Authorization: `Bearer ${tokens.access_token}` },
})
const header = (await check.json()).values?.[0]
if (!check.ok || !header) {
  console.error(`Signed in, but that account cannot read the Submissions sheet (HTTP ${check.status}). Sign in with the account that owns it.`)
  process.exit(1)
}
console.log(`Sheet check OK: ${header.length} columns (${header.slice(0, 3).join(', ')}, ...).`)

const vars = {
  GOOGLE_OAUTH_CLIENT_ID: clientId,
  GOOGLE_OAUTH_CLIENT_SECRET: clientSecret,
  GOOGLE_OAUTH_REFRESH_TOKEN: tokens.refresh_token,
}
let env = existsSync('.env.local') ? readFileSync('.env.local', 'utf8') : ''
for (const [k, v] of Object.entries(vars)) {
  const line = `${k}=${v}`
  env = new RegExp(`^${k}=.*$`, 'm').test(env) ? env.replace(new RegExp(`^${k}=.*$`, 'm'), line) : `${env.replace(/\n?$/, '\n')}${line}\n`
}
writeFileSync('.env.local', env)
console.log('Wrote GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET and GOOGLE_OAUTH_REFRESH_TOKEN to .env.local.')
