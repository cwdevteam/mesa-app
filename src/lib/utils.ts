import { type ClassValue, clsx } from 'clsx'
import { jwtDecode } from 'jwt-decode'
import { twMerge } from 'tailwind-merge'
import type { NextApiRequest } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const bpsToPercent = (bps: number) => `${(bps / 100).toFixed(2)}%`

export const decodeToken = (token: string = '') => {
  const decoded = jwtDecode(token)

  return decoded
}

export const getCookie = (req: NextApiRequest) => {
  return req.cookies[process.env.NEXT_PUBLIC_COOKIE || 'mesa_session'] || ''
}
