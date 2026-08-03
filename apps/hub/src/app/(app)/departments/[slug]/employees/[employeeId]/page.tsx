import { notFound } from 'next/navigation'
import { getDepartment } from '@/lib/departments'
import { getSupabaseServer } from '@/lib/supabase-server'
import type { HubAiEmployee } from '@/lib/types'
import { ChatPanel } from '@/components/ChatPanel'

export default async function EmployeeChatPage({
  params,
}: {
  params: Promise<{ slug: string; employeeId: string }>
}) {
  const { slug, employeeId } = await params
  const department = getDepartment(slug)
  if (!department) notFound()

  const supabase = await getSupabaseServer()
  const { data } = await supabase.from('hub_ai_employees').select('*').eq('id', employeeId).single()
  const employee = data as HubAiEmployee | null
  if (!employee || employee.department !== department.slug) notFound()

  return (
    <ChatPanel
      employeeId={employee.id}
      name={employee.name}
      subtitle={`${employee.role} · ${department.label}`}
      accent={department.accent}
      emptyHint={`Ask ${employee.name} anything about ${department.label} — they only see this department's tasks and notes.`}
    />
  )
}
