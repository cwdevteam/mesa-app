import { NextMiddleware, NextRequest, NextResponse } from 'next/server'

export type MiddlewareFactory = (next: NextMiddleware) => NextMiddleware

export function chain(arr: MiddlewareFactory[] = []): NextMiddleware {
  if (arr.length > 0) {
    const [a, ...bs] = arr
    const b = chain(bs)
    return a(b)
  }
  return () => NextResponse.next()
}
