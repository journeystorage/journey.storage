import { NotesView } from '@/components/NotesView'

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>
}) {
  const { department } = await searchParams
  return <NotesView initialDepartment={department} />
}
