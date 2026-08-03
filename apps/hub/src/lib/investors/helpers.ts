import type { HubDealInvestor, HubInvestor } from './types'

export function fmtUsd(n: number | null | undefined): string {
  if (n == null || n === 0) return ''
  return '$' + Number(n).toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  const currentYear = todayISO().slice(0, 4)
  return `${MONTHS[+m - 1]} ${+d}${y !== currentYear ? ` '${y.slice(2)}` : ''}`
}

export function daysFromToday(iso: string | null | undefined): number | null {
  if (!iso) return null
  return Math.round((new Date(`${iso}T00:00`).getTime() - new Date(`${todayISO()}T00:00`).getTime()) / 86_400_000)
}

export function dueClass(iso: string | null | undefined): 'overdue' | 'today' | 'soon' | 'later' {
  const d = daysFromToday(iso)
  if (d == null) return 'later'
  if (d < 0) return 'overdue'
  if (d === 0) return 'today'
  if (d <= 3) return 'soon'
  return 'later'
}

export function dueText(iso: string | null | undefined): string {
  const d = daysFromToday(iso)
  if (d == null) return ''
  if (d < 0) return `${Math.abs(d)}d overdue`
  if (d === 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  return fmtDate(iso)
}

export function nextBizDay(n: number): string {
  const d = new Date(`${todayISO()}T00:00`)
  d.setDate(d.getDate() + n)
  if (d.getDay() === 6) d.setDate(d.getDate() + 2)
  if (d.getDay() === 0) d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

export interface EntryRow {
  investor: HubInvestor
  entry: HubDealInvestor
}

function joinEntries(entries: HubDealInvestor[], investorsById: Map<string, HubInvestor>): EntryRow[] {
  return entries
    .map((entry) => ({ investor: investorsById.get(entry.investor_id), entry }))
    .filter((x): x is EntryRow => Boolean(x.investor))
}

export function followUpItems(entries: HubDealInvestor[], investorsById: Map<string, HubInvestor>): EntryRow[] {
  const items = joinEntries(entries.filter((e) => e.next_follow_up && e.stage !== 'out'), investorsById)
  items.sort(
    (a, b) =>
      (a.entry.next_follow_up ?? '').localeCompare(b.entry.next_follow_up ?? '') ||
      a.investor.name.localeCompare(b.investor.name),
  )
  return items
}

export interface DealStats {
  entries: EntryRow[]
  funded: EntryRow[]
  committed: EntryRow[]
  fundedSum: number
  commitSum: number
  backupSum: number
  leads: EntryRow[]
  outs: EntryRow[]
}

export function dealStats(
  dealId: string,
  allEntries: HubDealInvestor[],
  investorsById: Map<string, HubInvestor>,
): DealStats {
  const entries = joinEntries(allEntries.filter((e) => e.deal_id === dealId), investorsById)
  const funded = entries.filter((x) => x.entry.funded)
  const committed = entries.filter((x) => x.entry.stage === 'committed')
  const fundedSum = funded.reduce((s, x) => s + (x.entry.amount ?? 0), 0)
  const commitSum = committed.reduce((s, x) => s + (x.entry.amount ?? 0), 0)
  const backupSum = entries.reduce(
    (s, x) => s + (x.entry.backup_amount ?? 0) + (x.entry.stage === 'backup' ? x.entry.amount ?? 0 : 0),
    0,
  )
  const leads = entries.filter((x) => x.entry.stage === 'lead' || x.entry.stage === 'engaged')
  const outs = entries.filter((x) => x.entry.stage === 'out')
  return { entries, funded, committed, fundedSum, commitSum, backupSum, leads, outs }
}
