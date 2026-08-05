import { Sidebar } from '@/components/Sidebar'
import { JarvisDock } from '@/components/JarvisDock'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="hub-atmosphere" aria-hidden />
      <Sidebar />
      <main className="relative z-10 min-h-screen flex-1 overflow-y-auto">{children}</main>
      <JarvisDock />
    </div>
  )
}
