// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { decodeToken, getCookie } from '@/lib/utils'
import { serialize } from 'cookie'
import axios from 'axios'

type Data = {
  status: boolean
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const session = getCookie(req)
    const decoded = decodeToken(session)

    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      const cookie = serialize(
        process.env.NEXT_PUBLIC_COOKIE || 'mesa_session',
        '',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: -1,
          path: '/',
        }
      )
      res.setHeader('Set-Cookie', cookie)

      return res.status(200).json({
        status: false,
        data: null,
      })
    }

    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + '/auth/refresh',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    const cookie = serialize(
      process.env.NEXT_PUBLIC_COOKIE || 'mesa_session',
      data.token || '',
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 1,
        path: '/',
      }
    )

    res.setHeader('Set-Cookie', cookie)

    res.status(200).json({
      status: true,
      data: decoded,
    })
  } catch (err) {
    const cookie = serialize(
      process.env.NEXT_PUBLIC_COOKIE || 'mesa_session',
      '',
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: -1,
        path: '/',
      }
    )
    res.setHeader('Set-Cookie', cookie)
    res.status(500).json({ status: false })
  }
}
