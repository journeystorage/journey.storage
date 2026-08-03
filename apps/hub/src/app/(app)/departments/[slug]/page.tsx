import { notFound } from 'next/navigation'
import { getDepartment } from '@/lib/departments'
import { DepartmentDetail } from '@/components/DepartmentDetail'

export default async function DepartmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const department = getDepartment(slug)
  if (!department) notFound()

  return <DepartmentDetail slug={department.slug} label={department.label} accent={department.accent} />
}
