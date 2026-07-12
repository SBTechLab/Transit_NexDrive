import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { canAccessRoute } from '@/lib/rbac'
import { Role } from '@prisma/client'

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/forgot-password' || pathname === '/reset-password') {
      return NextResponse.next()
    }

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Force password change check
    if (token.forcePasswordChange && pathname !== '/change-password' && !pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/change-password', req.url))
    }

    if (pathname === '/change-password') {
      return NextResponse.next()
    }

    // Role-Based Access Control logic
    if (pathname !== '/' && !canAccessRoute(token.role as Role, pathname)) {
      // API routes return 403
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // UI routes redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
