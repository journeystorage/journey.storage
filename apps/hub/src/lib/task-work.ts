import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { gatherJarvisContext, runJarvisLoop } from '@/lib/jarvis-loop'
import { saveToDrive } from '@/lib/google'
import type { HubAiEmployee, HubTask } from '@/lib/types'

export interface TaskWorkResult {
  toolsUsed: string[]
  savedNote: boolean
}

// Shared by the scheduled work engine (api/agents/work) and the "approve a
// proposed task" flow (api/proposals) — one employee actually working one
// task with real tools, not a simulation. The two callers differ on exactly
// one axis: allowDone. The work engine runs unattended on a schedule, so a
// task it touches always ends at "doing", never "done" — finishing stays a
// human call. Approving a proposal is itself a deliberate, present human
// action, so that path may let the employee actually close the task out —
// but only if it explicitly says so via update_task; silence still means
// "doing", not an assumed done.
export async function executeTaskWork({
  supabase,
  employee,
  task,
  userEmail,
  allowDone,
}: {
  supabase: SupabaseClient
  employee: HubAiEmployee
  task: HubTask
  userEmail: string | null
  allowDone: boolean
}): Promise<TaskWorkResult> {
  const context = await gatherJarvisContext(supabase, employee)

  const completionRule = allowDone
    ? `If you've genuinely finished this — the real deliverable exists and there's nothing left to do — call update_task on task_id ${task.id} with status "done". If it's a draft that still needs Lyvia or Jonah's review before it's usable, leave it at "doing" (the default) and say so.`
    : `Call update_task on task_id ${task.id} to reflect real progress in its notes — but never set its status to "done"; only Lyvia or Jonah closes out a task.`

  const instruction = `Work session. Your assigned task right now:
"${task.title}"${task.notes ? `\nTask detail: ${task.notes}` : ''} (task_id: ${task.id})

Actually do the work — use your tools for real, the same way you would if Lyvia asked you directly. Save the real deliverable (the work product itself, or the strongest possible draft of it — not a plan to make one) with create_note, titled "Draft: ..." if it needs review before use. If this task is about an investor relationship, use your investor tools to update the actual record. ${completionRule} Ground your work in your document library and recent notes where relevant. End with one sentence on what you did and what remains.`

  const { fullText, toolCalls } = await runJarvisLoop({
    supabase,
    employee,
    userEmail,
    context,
    messages: [{ role: 'user', content: instruction }],
    onDelta: () => {},
    logChat: false,
  })

  // Safety net: if the model never actually saved a note, the raw output
  // becomes the note itself — some record of the work always lands.
  const savedNote = toolCalls.some((c) => c.name === 'create_note')
  if (!savedNote && fullText.trim()) {
    const title = `Draft: ${task.title}`.slice(0, 200)
    await supabase.from('hub_notes').insert({
      title: `${employee.name}: ${title}`,
      content: fullText,
      department: employee.department,
    })
    if (userEmail) {
      try {
        await saveToDrive(supabase, userEmail, employee.name, title, fullText)
      } catch {
        // Google not connected — note still saved in the hub.
      }
    }
  }

  const calledUpdateThisTask = toolCalls.some((c) => c.name === 'update_task' && c.input.task_id === task.id)

  if (allowDone) {
    // Trust whatever the model already set via its own update_task call —
    // including "done". If it never touched the task at all, it still
    // needs to move off its original status so progress is visible.
    if (!calledUpdateThisTask) {
      await supabase.from('hub_tasks').update({ status: 'doing', updated_at: new Date().toISOString() }).eq('id', task.id)
    }
  } else {
    // Unconditionally enforced regardless of what the model did — reverts
    // "done" back to "doing" if it tried anyway.
    await supabase
      .from('hub_tasks')
      .update({ status: 'doing', updated_at: new Date().toISOString() })
      .eq('id', task.id)
      .neq('status', 'doing')
  }

  return { toolsUsed: toolCalls.map((c) => c.name), savedNote: savedNote || Boolean(fullText.trim()) }
}
