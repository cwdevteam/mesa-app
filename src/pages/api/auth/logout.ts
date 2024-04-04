// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

type Data = {
  status: boolean
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
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
    res.json({
      status: true,
      message: 'Successfully logout',
    })
  } catch (err) {
    res.status(500).json({ status: false, message: 'Somthing went wrong' })
  }
}
