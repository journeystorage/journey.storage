'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import type { HubDeal, HubDealInvestor, HubInvestor } from './types'

export interface InvestorsData {
  deals: HubDeal[]
  investors: HubInvestor[]
  entries: HubDealInvestor[]
  investorsById: Map<string, HubInvestor>
  loading: boolean
  refetch: () => Promise<void>
  // Call while a drawer/modal is open so a remote realtime update doesn't
  // clobber an in-progress edit — same safeguard the old investors.html had.
  setPaused: (paused: boolean) => void
}

// Shared by every Investors CRM view — one fetch, one realtime
// subscription (Lyvia's and Jonah's sessions stay in sync), reused
// instead of every page rolling its own.
export function useInvestorsData(): InvestorsData {
  const [deals, setDeals] = useState<HubDeal[]>([])
  const [investors, setInvestors] = useState<HubInvestor[]>([])
  const [entries, setEntries] = useState<HubDealInvestor[]>([])
  const [loading, setLoading] = useState(true)
  const pausedRef = useRef(false)

  const refetch = useCallback(async () => {
    const supabase = getSupabaseBrowser()
    const [{ data: dealRows }, { data: investorRows }, { data: entryRows }] = await Promise.all([
      supabase.from('hub_deals').select('*').order('created_at', { ascending: true }),
      supabase.from('hub_investors').select('*').order('name', { ascending: true }),
      supabase.from('hub_deal_investors').select('*'),
    ])
    setDeals((dealRows as HubDeal[]) ?? [])
    setInvestors((investorRows as HubInvestor[]) ?? [])
    setEntries((entryRows as HubDealInvestor[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refetch()
    const supabase = getSupabaseBrowser()
    const channel = supabase
      .channel('hub_investors_crm')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hub_deal_investors' }, () => {
        if (!pausedRef.current) refetch()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'hub_investors' }, () => {
        if (!pausedRef.current) refetch()
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [refetch])

  const investorsById = new Map(investors.map((i) => [i.id, i]))

  return {
    deals,
    investors,
    entries,
    investorsById,
    loading,
    refetch,
    setPaused: (paused: boolean) => {
      pausedRef.current = paused
    },
  }
}
