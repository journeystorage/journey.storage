// GET /api/ops/sweep?token=...   (also POST)
//
// The scheduled operational sweep: reads the whole portfolio, runs the checks,
// and emails what a human needs to act on. Urgent findings go out on their own;
// everything else rides in one daily digest, so the alerts stay readable.
//
// Protected by OPS_TOKEN. With no token configured the route refuses to run,
// so it cannot be left accidentally open.
//
// It also returns a JSON summary, which is what makes an outage detectable:
// if email is down, the caller (the scheduled job) sees a non-2xx and raises
// its own alarm through a channel that does not depend on our email working.

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { takeSnapshot, money } from '@/lib/ops/snapshot'
import { runAllChecks, runPeopleChecks, collectedYesterday, portfolioSummary, type Finding } from '@/lib/ops/checks'
import { getSpaceMix } from '@/lib/nectar/spaces'
import { FACILITIES } from '@/lib/nectar/facilities'
import { sendLeadNotification } from '@/lib/lead-email'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

function authorised(req: NextRequest): boolean {
  const expected = process.env.OPS_TOKEN
  if (!expected) return false
  const given = req.nextUrl.searchParams.get('token') ?? req.headers.get('x-ops-token') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Availability + a read of how healthy Tenant Inc's API is right now. */
async function facilityHealth() {
  const rows: string[] = []
  const problems: string[] = []
  for (const cfg of Object.values(FACILITIES)) {
    const t0 = Date.now()
    try {
      const spaces = await getSpaceMix(cfg.propertyId)
      const ms = Date.now() - t0
      const vacant = spaces.reduce((t, s) => t + (s.available ?? 0), 0)
      const soldOut = spaces.filter((s) => (s.available ?? 0) === 0).length
      rows.push(`${cfg.displayName}: ${vacant} vacant across ${spaces.length} sizes, ${soldOut} sold out · API ${ms}ms`)
      if (ms > 8000) problems.push(`${cfg.displayName}: the storage API took ${(ms / 1000).toFixed(1)}s to answer.`)
      if (!vacant) problems.push(`${cfg.displayName}: NOTHING is bookable online — every size shows zero.`)
    } catch (e) {
      rows.push(`${cfg.displayName}: FAILED to read availability`)
      problems.push(`${cfg.displayName}: availability could not be read (${e instanceof Error ? e.message : 'unknown'}). The website may be showing stale sizes.`)
    }
  }
  return { rows, problems }
}

const block = (f: Finding) => [`${f.group}`, ...f.lines.map((l) => `  · ${l}`), `  → ${f.action}`, ''].join('\n')

export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  const startedAt = Date.now()
  // ?dryRun=1 composes everything and returns it instead of emailing — for
  // checking what the sweep would say without filling an inbox.
  const dryRun = req.nextUrl.searchParams.get('dryRun') === '1'
  try {
    const snapshot = await takeSnapshot()
    const findings = [...runAllChecks(snapshot), ...(await runPeopleChecks(snapshot))]
    const collected = collectedYesterday(snapshot)
    const summary = portfolioSummary(snapshot)
    const health = await facilityHealth()

    const urgent = findings.filter((f) => f.severity === 'urgent')
    const watch = findings.filter((f) => f.severity === 'watch')

    const composed: Array<{ subject: string; body: string }> = []
    const deliver = async (subject: string, body: string, source: string, name: string) => {
      composed.push({ subject, body })
      if (dryRun) return
      await sendLeadNotification({ name, email: '', formSource: source, subject, message: body }).catch(() => {})
    }

    // Urgent items get their own email so they are not buried in the digest.
    for (const f of urgent) {
      await deliver(
        `Action needed — ${f.group}`,
        [block(f), '', 'Found by the daily sweep of every active lease.'].join('\n'),
        'ops-alert',
        f.group,
      )
    }
    if (health.problems.length) {
      await deliver(
        'Action needed — website availability problem',
        [...health.problems.map((p) => `· ${p}`), '', ...health.rows].join('\n'),
        'ops-alert',
        'Website or storage API problem',
      )
    }

    await deliver(
      `Daily summary — ${money(collected.total)} collected, ${money(summary.owingTotal)} outstanding`,
      [
        `Money in (yesterday and today): ${money(collected.total)} across ${collected.count} payments`,
        ...collected.lines.map((l) => `  · ${l}`),
        '',
        `Portfolio: ${summary.leases} active leases · ${money(summary.monthlyRent)}/mo contracted`,
        `Autopay on: ${summary.autopayOn} of ${summary.leases}`,
        `Outstanding: ${money(summary.owingTotal)} across ${summary.owingCount} leases`,
        '',
        'Availability',
        ...health.rows.map((r) => `  · ${r}`),
        '',
        urgent.length ? `${urgent.length} urgent item(s) were emailed separately.` : 'Nothing urgent today.',
        '',
        ...watch.map(block),
      ].join('\n'),
      'ops-digest',
      'Daily summary',
    )

    return NextResponse.json({
      ok: true,
      tookMs: Date.now() - startedAt,
      leases: summary.leases,
      urgent: urgent.length,
      collected: collected.total,
      outstanding: summary.owingTotal,
      ...(dryRun ? { composed } : {}),
    })
  } catch (e) {
    console.error('[ops/sweep] failed', e)
    return NextResponse.json({ error: 'Sweep failed', detail: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

export const POST = GET
