import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/database.types'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin/login'
  // Unauthenticated flows live alongside /admin/login.
  const isPublicAdminFlow =
    pathname === '/admin/forgot-password' ||
    pathname === '/admin/reset-password'

  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — required by @supabase/ssr
  const { data: { user } } = await supabase.auth.getUser()

  const isAdmin = user
    ? await (async () => {
        const { data } = await supabase
          .from('admin_profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()
        return !!data
      })()
    : false

  if (isLoginPage) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return response
  }

  // Public flows (forgot/reset password) are reachable both signed-in and out.
  if (isPublicAdminFlow) return response

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
