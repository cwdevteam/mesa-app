// import { chain } from '@/middleware/util'
// import { withTrace } from '@/middleware/withTrace'
// import { MiddlewareFactory } from '@/middleware/util'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { NextResponse, NextFetchEvent } from 'next/server'

function getSession() {
  const cookieStore = cookies()
  const sessoinData = cookieStore.get(
    process.env.NEXT_PUBLIC_COOKIE || 'mesa_session'
  )

  return sessoinData?.value || ''
}

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent
) {
  if (
    request.nextUrl.pathname.startsWith(`/auth/`) ||
    request.nextUrl.pathname.startsWith(`/invite/`)
  ) {
    return NextResponse.next({
      request,
    })
  }

  const session = request.cookies.get('mesa_session')?.value

  // if user is signed in and the current path is /<locale> redirect the user to /<locale>/dashboard
  if (session && request.nextUrl.pathname === `/`) {
    console.log('auth: user is signed in, redirect to dashboard')
    return NextResponse.redirect(new URL(`/dashboard`, request.url))
  }

  // if user is not signed in and the current path is not /<locale> redirect the user to /<locale>
  if (!session && request.nextUrl.pathname !== `/`) {
    console.log('auth: user is not signed in, redirect to sign in page')
    return NextResponse.redirect(new URL(`/`, request.url))
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|static|favicon.ico).*)'],
}
