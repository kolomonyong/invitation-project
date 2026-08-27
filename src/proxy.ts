// src/proxy.ts
// Next.js 16 Proxy (replaces deprecated middleware.ts)
// Handles: session refresh, auth protection, and session expiry (4 hours)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Session timeout: 4 hours in seconds
const SESSION_MAX_AGE = 4 * 60 * 60

// Routes that require authentication
const PROTECTED_PATHS = ['/dashboard', '/editor']

// Routes that should redirect to dashboard if already authenticated
const AUTH_PATHS = ['/login']

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              // Enforce 4-hour max session lifetime via cookie maxAge
              maxAge: SESSION_MAX_AGE,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          )
        },
      },
    }
  )

  // IMPORTANT: Do NOT use supabase.auth.getSession() — it reads from
  // potentially stale cookies. getUser() sends a request to Supabase Auth
  // to revalidate the Auth token, guaranteeing the data is fresh.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  )

  // Check if the path is an auth path (login/signup)
  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path))

  // Redirect unauthenticated users away from protected routes
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('expired', 'true')
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthPath && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - invite/* (public invitation pages — no auth needed)
     * - api/payment/webhook (Pakasir webhook — no auth needed)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|invite|api/payment/webhook).*)',
  ],
}
