import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const username = 'senkardesler'
  const password = 'bakimim3552'
  const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

  if (authHeader !== basicAuth) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Private"' },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
