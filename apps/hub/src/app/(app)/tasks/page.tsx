import { TasksView } from '@/components/TasksView'

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>
}) {
  const { department } = await searchParams
  return <TasksView initialDepartment={department} />
}
