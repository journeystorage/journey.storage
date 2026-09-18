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
import { takeSnapshot, money, moneyShort } from '@/lib/ops/snapshot'
import { runAllChecks, runPeopleChecks, collectedYesterday, portfolioSummary, findingLines, type Finding } from '@/lib/ops/checks'
import { stat, statBand, section, dataTable, callout, miniList, p as para } from '@/lib/email-shell'
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

/** Plain-text rendering, kept for the digest's text body. */
const block = (f: Finding) =>
  [`${f.group}${f.total ? ` — ${money(f.total)}` : ''}`, ...findingLines(f).map((l) => `  · ${l}`), `  → ${f.action}`, ''].join('\n')

/** One finding as a scannable block: figure first, then the rows, then what to do. */
const findingHtml = (f: Finding) =>
  statBand([
    stat(f.total != null ? money(f.total) : String(f.rows.length), f.total != null ? 'at stake' : 'to deal with', 'alert'),
    stat(String(f.rows.length), f.rows.length === 1 ? 'account' : 'accounts'),
  ]) +
  dataTable(f.rows.map((r) => ({ ...r, amount: r.amount != null ? money(r.amount) : undefined }))) +
  callout(f.action)

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

    const composed: Array<{ subject: string; body: string; html?: string }> = []
    const deliver = async (subject: string, body: string, source: string, name: string, bodyHtml?: string) => {
      composed.push({ subject, body, html: bodyHtml })
      if (dryRun) return
      await sendLeadNotification({ name, email: '', formSource: source, subject, message: body, bodyHtml, heading: name }).catch(() => {})
    }

    // Urgent items get their own email so they are not buried in the digest.
    for (const f of urgent) {
      await deliver(
        `Action needed — ${f.group}${f.total ? ` (${money(f.total)})` : ''}`,
        [block(f), '', 'Found by the daily sweep of every active lease.'].join('\n'),
        'ops-alert',
        f.group,
        findingHtml(f),
      )
    }
    if (health.problems.length) {
      await deliver(
        'Action needed — website availability problem',
        [...health.problems.map((p) => `· ${p}`), '', ...health.rows].join('\n'),
        'ops-alert',
        'Website or storage API problem',
        health.problems.map((pr) => callout(pr)).join('') + section('Availability') + miniList(health.rows.map((r) => [r.split('·')[0].trim(), r.split('·').slice(1).join('·').trim()] as [string, string])),
      )
    }

    const pct = summary.leases ? Math.round((summary.autopayOn / summary.leases) * 100) : 0
    const topPayments = [...collected.lines]
      .map((l) => ({
        date: l.slice(0, 10),
        name: l.split(' · ')[1] ?? '',
        place: l.split(' · ').slice(2).join(' · ').split(' — ')[0] ?? '',
        amount: Number((l.split(' — ').pop() ?? '').replace(/[^0-9.]/g, '')) || 0,
      }))
      .sort((a, b) => b.amount - a.amount)
    const shown = topPayments.slice(0, 5)
    const restTotal = topPayments.slice(5).reduce((t, x) => t + x.amount, 0)

    const digestHtml =
      // The three figures that decide whether today needs anything.
      statBand([
        stat(moneyShort(collected.total), 'collected', 'good'),
        stat(moneyShort(summary.owingTotal), 'outstanding', summary.owingTotal > 0 ? 'alert' : 'normal'),
        stat(String(summary.owingCount), 'accounts owing'),
      ]) +
      (urgent.length
        ? callout(`${urgent.length} item${urgent.length === 1 ? '' : 's'} need attention — each sent as its own email so it doesn’t get lost in here.`)
        : para('Nothing needs attention today.', { muted: true })) +
      // Health before history: these change slowly and are worth watching.
      section('Portfolio') +
      miniList([
        ['Active leases', String(summary.leases)],
        ['Contracted rent', `${money(summary.monthlyRent)}/mo`],
        ['On autopay', `${summary.autopayOn} of ${summary.leases} (${pct}%)`],
        ['Not on autopay', `${summary.leases - summary.autopayOn}`],
      ]) +
      section('Availability') +
      miniList(
        health.rows.map((r) => {
          const [name, ...rest] = r.split(':')
          return [name.trim(), rest.join(':').trim()] as [string, string]
        }),
      ) +
      // The routine good news, summarised rather than itemised — the total is
      // already in the band above, so only the largest few earn their space.
      section('Money in', collected.count) +
      (collected.count
        ? dataTable(shown.map((x) => ({ who: x.name, where: x.place, note: x.date, amount: money(x.amount) }))) +
          (topPayments.length > 5
            ? para(`…and ${topPayments.length - 5} more payments totalling ${money(restTotal)}.`, { muted: true, small: true })
            : '')
        : para('No payments in the last two days.', { muted: true })) +
      (watch.length ? watch.map((f) => section(f.group, f.rows.length) + findingHtml(f)).join('') : '')

    await deliver(
      `Daily summary — ${money(collected.total)} in, ${money(summary.owingTotal)} outstanding`,
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
      digestHtml,
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
