import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON_KEY, HUB_ALLOWED_EMAILS } from '@/lib/constants'

// Gates every route except /login itself. Two layers, matching the
// investors CRM's pattern (apps/portal/investors.html): an app-level check
// here, plus RLS at the database level as defense in depth (see
// supabase/hub_setup.sql) — this middleware is convenience/UX, not the only
// thing standing between a stray session and the data.
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl
  const isLoginRoute = pathname === '/login'
  const isApiRoute = pathname.startsWith('/api/')

  if (user && !HUB_ALLOWED_EMAILS.includes(user.email ?? '')) {
    await supabase.auth.signOut()
    if (!isLoginRoute) {
      return isApiRoute
        ? NextResponse.json({ error: 'unauthorized' }, { status: 401 })
        : NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  const isAuthed = Boolean(user && HUB_ALLOWED_EMAILS.includes(user.email ?? ''))

  if (!isAuthed && !isLoginRoute) {
    return isApiRoute
      ? NextResponse.json({ error: 'unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthed && isLoginRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)',
  ],
}
