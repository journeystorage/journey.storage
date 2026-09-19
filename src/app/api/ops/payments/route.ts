// GET /api/ops/payments?token=...
//
// Tells staff when a tenant has paid. Tenant Inc has no webhook and their
// company `events` feed returns empty under every parameter tried, so this
// polls each lease's ledger — the only reliable payment record — and reports
// rows it hasn't reported before.
//
// Payments it has already announced are remembered in ops_events as
// 'payment_seen', keyed on the ledger row id, so it can run often without
// repeating itself. Designed for an hourly schedule alongside the daily sweep.

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { nectarV2 } from '@/lib/nectar/client'
import { COMPANY_ID } from '@/lib/nectar/facilities'
import { money } from '@/lib/ops/snapshot'
import { recentEvents, recordEvents } from '@/lib/ops/events'
import { sendLeadNotification } from '@/lib/lead-email'
import { section, dataTable, statBand, stat, p as para } from '@/lib/email-shell'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

const co = () => COMPANY_ID
/** Payments older than this are ignored, so a first run can't flood the inbox. */
const LOOK_BACK_DAYS = 2

function authorised(req: NextRequest): boolean {
  const expected = process.env.OPS_TOKEN
  if (!expected) return false
  const given = req.nextUrl.searchParams.get('token') ?? req.headers.get('x-ops-token') ?? ''
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

interface TenantRow {
  lease_id?: string
  Contact?: { first?: string; last?: string; email?: string }
}

async function pooled<T, R>(items: T[], size: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(work))))
  }
  return out
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  const dryRun = req.nextUrl.searchParams.get('dryRun') === '1'
  try {
    // Who holds which lease. The ledger doesn't carry a name, so pair them up.
    const byLease = new Map<string, string>()
    for (let offset = 0; offset < 4000; offset += 100) {
      const { data } = await nectarV2<{ tenant?: TenantRow[]; paging?: { total?: number } }>(
        `companies/${co()}/tenants`,
        { query: { limit: 100, offset, status: 'active' } },
      )
      const page = data.tenant ?? []
      if (!page.length) break
      for (const t of page) {
        if (t.lease_id && !byLease.has(t.lease_id)) {
          byLease.set(t.lease_id, `${t.Contact?.first ?? ''} ${t.Contact?.last ?? ''}`.trim() || 'A tenant')
        }
      }
      if (offset + 100 >= (data.paging?.total ?? 0)) break
    }

    const since = new Date(Date.now() - LOOK_BACK_DAYS * 86_400_000).toISOString().slice(0, 10)
    const found = await pooled([...byLease.entries()], 8, async ([leaseId, name]) => {
      try {
        const { data } = await nectarV2<{ ledger?: Array<{ id?: string; date?: string; payments?: number; status?: string }> }>(
          `companies/${co()}/leases/${leaseId}/ledger`,
        )
        return (data.ledger ?? [])
          .filter((r) => (r.payments ?? 0) > 0 && r.id && String(r.date ?? '').slice(0, 10) >= since)
          .map((r) => ({ id: r.id!, leaseId, name, date: String(r.date).slice(0, 10), amount: Number(r.payments), status: r.status }))
      } catch {
        return []
      }
    })
    // One payment can settle several leases at once, and it then appears on
    // every one of those ledgers with the SAME row id — J. C. Tribble's $473
    // covering four units showed up four times. Dedupe by ledger id or the
    // reported total is multiplied.
    const byId = new Map<string, (typeof found)[number][number]>()
    for (const x of found.flat()) if (!byId.has(x.id)) byId.set(x.id, x)
    const payments = [...byId.values()]

    // Anything already announced stays quiet.
    const seen = new Set(
      (await recentEvents(['payment_seen'], 24 * (LOOK_BACK_DAYS + 5))).map((e) => (e.contact ?? '').toLowerCase()),
    )
    const fresh = payments.filter((x) => !seen.has(x.id.toLowerCase())).sort((a, b) => b.amount - a.amount)

    // First ever run: there is no history, so everything in the window looks
    // new. Record it silently rather than sending a two-day backlog.
    if (!seen.size && fresh.length) {
      if (!dryRun) {
        await recordEvents(
          fresh.map((x) => ({ kind: 'payment_seen' as const, contact: x.id, name: x.name, detail: { leaseId: x.leaseId, amount: x.amount, date: x.date, baseline: true } })),
        )
      }
      return NextResponse.json({
        ok: true,
        baseline: true,
        leasesChecked: byLease.size,
        paymentsInWindow: payments.length,
        newlyReported: 0,
        note: 'First run — existing payments recorded as already seen, no email sent.',
      })
    }

    if (fresh.length) {
      const total = fresh.reduce((t, x) => t + x.amount, 0)
      const one = fresh.length === 1
      await sendLeadNotification({
        name: one ? `${fresh[0].name} paid ${money(fresh[0].amount)}` : `${fresh.length} payments received`,
        email: '',
        formSource: 'paybill-paid',
        subject: one
          ? `Payment received — ${money(fresh[0].amount)} from ${fresh[0].name}`
          : `${fresh.length} payments received — ${money(total)}`,
        heading: one ? `Payment <b>received</b>` : `Payments <b>received</b>`,
        highlightHtml: statBand([
          stat(money(total), one ? 'paid' : 'paid in total', 'good'),
          ...(one ? [] : [stat(String(fresh.length), 'payments')]),
        ]),
        bodyHtml:
          section(one ? 'Payment' : 'Payments', one ? undefined : fresh.length) +
          dataTable(fresh.slice(0, 40).map((x) => ({ who: x.name, note: `${x.date}${x.status ? ` · ${x.status}` : ''}`, amount: money(x.amount) }))) +
          (fresh.length > 40 ? para(`…and ${fresh.length - 40} more.`, { muted: true, small: true }) : '') +
          para('Taken from the lease ledger, so this is money actually posted — not just an attempt.', { muted: true, small: true }),
        message: [
          one ? `${fresh[0].name} paid ${money(fresh[0].amount)}.` : `${fresh.length} payments totalling ${money(total)}.`,
          '',
          ...fresh.map((x) => `  ${x.date} · ${x.name} — ${money(x.amount)}${x.status ? ` (${x.status})` : ''}`),
          '',
          'From the lease ledger: money actually posted, not just attempted.',
        ].join('\n'),
      }).catch(() => {})
      if (!dryRun) {
        await recordEvents(
          fresh.map((x) => ({
            kind: 'payment_seen' as const,
            contact: x.id,
            name: x.name,
            detail: { leaseId: x.leaseId, amount: x.amount, date: x.date },
          })),
        )
      }
    }

    return NextResponse.json({
      ok: true,
      leasesChecked: byLease.size,
      paymentsInWindow: payments.length,
      newlyReported: fresh.length,
      ...(dryRun ? { fresh: fresh.slice(0, 10) } : {}),
    })
  } catch (e) {
    console.error('[ops/payments] failed', e)
    return NextResponse.json({ error: 'Payment check failed', detail: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

export const POST = GET
