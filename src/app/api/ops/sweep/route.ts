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
import { takeSnapshot, money, moneyShort, prettyContact, shortDate } from '@/lib/ops/snapshot'
import { runAllChecks, runPeopleChecks, collectedYesterday, portfolioSummary, findingLines, type Finding } from '@/lib/ops/checks'
import { stat, statBand, section, dataTable, callout, miniList, p as para } from '@/lib/email-shell'
import { getSpaceMix } from '@/lib/nectar/spaces'
import { FACILITIES } from '@/lib/nectar/facilities'
import { sendLeadNotification, renderLeadNotification } from '@/lib/lead-email'

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

/** A finding's headline figures, for the dark hero band. */
const findingFigures = (f: Finding) =>
  statBand([
    stat(f.total != null ? moneyShort(f.total) : String(f.rows.length), f.total != null ? 'at stake' : 'to deal with', 'alert'),
    stat(String(f.rows.length), f.rows.length === 1 ? 'account' : 'accounts'),
  ])

/** How many rows an alert lists before summarising the rest. */
const ROW_CAP = 15

/**
 * A finding's detail, for the cream band. The instruction comes first — on a
 * 50-row list it would otherwise sit at the bottom where nobody reaches it.
 * Long lists get a per-facility breakdown, since each site has its own inbox
 * and staff, then the worst rows, then one line for the remainder.
 */
const findingBody = (f: Finding) => {
  const rowsHtml = (list: Finding['rows']) =>
    dataTable(list.map((r) => ({
      ...r,
      amount: r.amount != null ? money(r.amount) : undefined,
      contact: prettyContact(r.contact),
    })))

  const facilityOf = (where?: string) => (where ?? 'Unknown site').split(' · ')[0]
  const byFacility = new Map<string, { n: number; total: number }>()
  for (const r of f.rows) {
    const k = facilityOf(r.where)
    const cur = byFacility.get(k) ?? { n: 0, total: 0 }
    byFacility.set(k, { n: cur.n + 1, total: cur.total + (r.amount ?? 0) })
  }

  const shown = f.rows.slice(0, ROW_CAP)
  const rest = f.rows.slice(ROW_CAP)
  const restTotal = rest.reduce((t, r) => t + (r.amount ?? 0), 0)

  return (
    callout(f.action) +
    (f.rows.length > 8 && byFacility.size > 1
      ? section('By facility') +
        miniList(
          [...byFacility.entries()]
            .sort((a, b) => b[1].total - a[1].total)
            .map(([k, v]) => [k, `${v.n} · ${f.total != null ? money(v.total) : ''}`.replace(/ · $/, '')] as [string, string]),
        )
      : '') +
    section(rest.length ? `Top ${ROW_CAP} of ${f.rows.length}` : 'Accounts', rest.length ? undefined : f.rows.length) +
    rowsHtml(shown) +
    (rest.length
      ? para(`…and ${rest.length} more${restTotal ? ` totalling ${money(restTotal)}` : ''}. The full list is in Hummingbird.`, { muted: true, small: true })
      : '')
  )
}

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
    const deliver = async (
      subject: string,
      body: string,
      source: string,
      name: string,
      bodyHtml?: string,
      heading?: string,
      highlightHtml?: string,
    ) => {
      const lead = {
        name, email: '', formSource: source, subject, message: body,
        bodyHtml, heading: heading ?? name, highlightHtml,
      }
      // The preview is rendered by the same function the sender uses, so what
      // a dry run shows is exactly what would arrive.
      composed.push({ subject, body, html: renderLeadNotification(lead).html })
      if (dryRun) return
      await sendLeadNotification(lead).catch(() => {})
    }

    // Urgent items get their own email so they are not buried in the digest.
    for (const f of urgent) {
      await deliver(
        `Action needed — ${f.group}${f.total ? ` (${money(f.total)})` : ''}`,
        [block(f), '', 'Found by the daily sweep of every active lease.'].join('\n'),
        'ops-alert',
        f.group,
        findingBody(f),
        f.headline ?? f.group,
        findingFigures(f),
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

    // The three figures that decide whether today needs anything live in the
    // dark hero, where the one orange figure is allowed to carry the alarm.
    const digestFigures = statBand([
      stat(moneyShort(collected.total), 'collected', 'good'),
      stat(moneyShort(summary.owingTotal), 'outstanding', summary.owingTotal > 0 ? 'alert' : 'normal'),
      stat(String(summary.owingCount), 'accounts owing'),
    ])
    const digestHtml =
      (urgent.length
        ? callout(
            `${urgent.length} item${urgent.length === 1 ? '' : 's'} sent as ${urgent.length === 1 ? 'its' : 'their'} own email${urgent.length === 1 ? '' : 's'}, so nothing gets lost in here: ${urgent.map((f) => f.group.toLowerCase()).join(', ')}.`,
            'Needs attention',
          )
        : para('Nothing needs attention today.', { muted: true })) +
      // Health before history: these change slowly and are worth watching.
      section('Portfolio') +
      miniList([
        ['Active leases', String(summary.leases)],
        ['Contracted rent', `${moneyShort(summary.monthlyRent)}/mo`],
        ['On autopay', `${summary.autopayOn} of ${summary.leases} (${pct}%)`],
        ['Not on autopay', `${summary.leases - summary.autopayOn}`],
      ]) +
      section('Availability') +
      miniList(
        health.rows.map((r) => {
          const [name, ...rest] = r.split(':')
          // API timing only matters when it's slow, and that raises its own alert.
          const v = rest.join(':').replace(/\s*·\s*API \d+ms/, '').replace(' vacant across ', ' vacant · ').replace(' sizes, ', ' sizes · ').trim()
          return [name.trim(), v] as [string, string]
        }),
      ) +
      // The routine good news, summarised rather than itemised — the total is
      // already in the band above, so only the largest few earn their space.
      section('Money in', collected.count) +
      (collected.count
        ? dataTable(shown.map((x) => ({ who: x.name, where: x.place, note: shortDate(x.date), amount: money(x.amount) }))) +
          (topPayments.length > 5
            ? para(`…and ${topPayments.length - 5} more payments totalling ${money(restTotal)}.`, { muted: true, small: true })
            : '')
        : para('No payments in the last two days.', { muted: true })) +
      (watch.length ? watch.map((f) => section(f.group, f.rows.length) + findingBody(f)).join('') : '')

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
      'Your day <b>at a glance</b>',
      digestFigures,
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
