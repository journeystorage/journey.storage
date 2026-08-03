import { redirect } from 'next/navigation'

// Reaching this route at all means middleware already confirmed a valid,
// authorized session — anything else was redirected to /login upstream.
export default function RootPage() {
  redirect('/dashboard')
}
