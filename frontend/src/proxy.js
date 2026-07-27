import { NextResponse } from 'next/server'

export function proxy(request) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register']
  const isPublic = publicPaths.some(path => pathname.startsWith(path))

  if (isPublic) return NextResponse.next()

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
