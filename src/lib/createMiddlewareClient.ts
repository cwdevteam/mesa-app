import { cookies } from 'next/headers'
import { serialize } from 'cookie'

import { type NextRequest, NextResponse } from 'next/server'

export function getSession() {
  const cookieStore = cookies()
  const sessoinData = cookieStore.get(
    process.env.NEXT_PUBLIC_COOKIE || 'mesa_session'
  )

  return sessoinData?.value || ''
}

export async function createMiddlewareClient(request: NextRequest) {
  // Create an unmodified response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const result = await getTokenFromServer(getSession())

  if (result) {
    const cookie = serialize(
      process.env.NEXT_PUBLIC_COOKIE || 'mesa_session',
      result?.token || '',
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      }
    )
    response.headers.set('Set-Cookie', cookie)
  }

  return { auth: result, response }
}

const getTokenFromServer = async (session: string) => {
  try {
    if (!session || session === '') return null

    const result = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + '/activities/refresh',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: session,
        },
      }
    )

    return await result.json()
  } catch (err: any) {
    return null
  }
}

export type MiddlewareClient = ReturnType<typeof createMiddlewareClient>
