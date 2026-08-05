'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubDeal } from '@/lib/investors/types'

const BASE = '/departments/investor-relations/investors'

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [deals, setDeals] = useState<HubDeal[]>([])

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseBrowser()
      const { data } = await supabase.from('hub_deals').select('*').order('created_at', { ascending: true })
      setDeals((data as HubDeal[]) ?? [])
    }
    load()
  }, [])

  const tabs = [
    { href: BASE, label: 'Dashboard' },
    { href: `${BASE}/follow-ups`, label: 'Follow-Ups' },
    { href: `${BASE}/list`, label: 'Investors' },
    ...deals.map((d) => ({ href: `${BASE}/deals/${d.id}`, label: d.name })),
    { href: `${BASE}/network`, label: 'Network' },
    { href: `${BASE}/prospects`, label: 'Prospects' },
    { href: `${BASE}/thank-yous`, label: 'Thank Yous' },
  ]

  return (
    <div>
      <div className="border-b border-surface-border px-8 py-4">
        <div className="mb-2 flex items-center gap-1.5">
          <span className="hub-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />
          <p className="hud-label">Journey.Storage · Hub · Acquisitions · Investors CRM</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`whitespace-nowrap rounded-md px-3 py-2 font-sans text-body-sm font-medium transition-colors duration-150 ${
                  active ? 'bg-cyan/10 text-cyan' : 'text-stone hover:text-warm-white'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="px-8 py-8">{children}</div>
    </div>
  )
}
