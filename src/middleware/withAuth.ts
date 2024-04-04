import { NextResponse, NextRequest } from 'next/server'

import { MiddlewareFactory } from '@/middleware/util'
import { createMiddlewareClient } from '@/lib/createMiddlewareClient'

export const withAuth: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event) => {
    // Auth is not required for auth callback routes
    if (request.nextUrl.pathname.startsWith(`/auth/`)) {
      return next(request, event)
    }

    // Create supabase client for auth
    const { auth, response } = await createMiddlewareClient(request)

    // if user is signed in and the current path is /<locale> redirect the user to /<locale>/dashboard
    if (auth && request.nextUrl.pathname === `/`) {
      console.log('auth: user is signed in, redirect to dashboard')
      return NextResponse.redirect(new URL(`/dashboard`, request.url))
    }

    // if user is not signed in and the current path is not /<locale> redirect the user to /<locale>
    if (!auth && request.nextUrl.pathname !== `/`) {
      console.log('auth: user is not signed in, redirect to sign in page')
      return NextResponse.redirect(new URL(`/`, request.url))
    }

    return response
  }
}
