// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { serialize } from 'cookie'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: boolean
  message: string
  userData?: {
    id: string
    email: string
    username: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { token } = req.body

    const { data } = await axios.put(
      process.env.NEXT_PUBLIC_BASE_URL + '/auth/confirm',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: token,
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
    res.json({
      status: true,
      message: 'Successfully Sign In',
      userData: data.userData,
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ status: false, message: 'Invalid credentials.' })
  }
}
