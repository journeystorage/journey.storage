// Fixed set — six verticals matching the real org chart (Payroll + Monthly
// Cash Outlook docs), not user-managed. Keep in sync with the department
// check constraints in supabase/hub_setup.sql. Development absorbed
// Construction here since they're one real vertical (Journey.Contractors).
export const DEPARTMENTS = [
  { slug: 'finance', label: 'Finance', accent: 'var(--color-sky)' },
  { slug: 'marketing', label: 'Marketing', accent: 'var(--color-terracotta)' },
  { slug: 'investor-relations', label: 'Investor Relations', accent: 'var(--color-plum)' },
  { slug: 'acquisitions', label: 'Acquisitions', accent: 'var(--color-sunlight)' },
  { slug: 'development', label: 'Development & Construction', accent: 'var(--color-sage)' },
  { slug: 'operations', label: 'Operations', accent: 'var(--color-sand)' },
] as const

export type DepartmentSlug = (typeof DEPARTMENTS)[number]['slug']

export function getDepartment(slug: string) {
  return DEPARTMENTS.find((d) => d.slug === slug)
}

export function isDepartmentSlug(value: string): value is DepartmentSlug {
  return DEPARTMENTS.some((d) => d.slug === value)
}
