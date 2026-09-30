// GET /portal
//
// The Accounting Intake portal is an Apps Script web app. This route only
// sends people there. It used to be a static folder FTP'd onto the server by
// the Deploy Accounting Intake workflow, but every Hostinger redeploy of this
// site wiped it, so the redirect now ships with the site itself.
//
// The /exec URL is a live write endpoint and stays out of git: set
// ACCOUNTING_PORTAL_URL on the main site's Hostinger instance. It is read at
// request time, so a missing value shows a notice instead of breaking the build.

export const dynamic = 'force-dynamic'

export function GET() {
  const target = process.env.ACCOUNTING_PORTAL_URL
  if (target?.startsWith('https://script.google.com/')) {
    return new Response(null, {
      status: 302,
      headers: { Location: target, 'Cache-Control': 'no-store' },
    })
  }
  return new Response(
    'The accounting portal is temporarily unavailable. Please email lyvia@journey.storage.',
    { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } },
  )
}
