'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'
import { DEPARTMENTS } from '@/lib/departments'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/notes', label: 'Notes' },
  { href: '/chat', label: 'Jarvis' },
]

const SYSTEM_ITEMS = [
  { href: '/costs', label: 'Costs' },
  { href: '/connections', label: 'Connections' },
  { href: '/automations', label: 'Automations' },
]

function NavLink({ href, label, active, dot }: { href: string; label: string; active: boolean; dot?: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-2 font-sans text-body-sm font-medium transition-colors duration-150 ${
        active
          ? 'bg-cyan/10 text-warm-white border-l-2 border-cyan -ml-0.5 pl-[calc(0.75rem+2px)]'
          : 'text-stone hover:bg-surface-floating hover:text-warm-white'
      }`}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: dot }} />}
      {label}
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="hud-label mb-1 mt-6 px-3 font-semibold text-stone/70">{children}</p>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-surface-border bg-surface-elevated px-4 py-6">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="hub-pulse-dot h-2 w-2 rounded-full bg-cyan" aria-hidden />
        <div>
          <p className="hud-label">Journey.Storage</p>
          <p className="font-display text-h3 font-bold leading-none text-warm-white">Hub</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
        ))}

        <SectionLabel>Departments</SectionLabel>
        {DEPARTMENTS.map((dept) => {
          const href = `/departments/${dept.slug}`
          return <NavLink key={dept.slug} href={href} label={dept.label} active={isActive(href)} dot={dept.accent} />
        })}
        <NavLink href="/agents" label="Agents" active={isActive('/agents')} />
        <NavLink href="/insights" label="Insights" active={isActive('/insights')} />

        <SectionLabel>System</SectionLabel>
        {SYSTEM_ITEMS.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
        ))}
      </nav>

      <button
        onClick={handleSignOut}
        className="rounded-md px-3 py-2 text-left font-sans text-body-sm text-stone transition-colors duration-150 hover:bg-surface-floating hover:text-warm-white"
      >
        Sign out
      </button>
    </aside>
  )
}
