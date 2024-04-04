// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  status: boolean
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { email } = req.body

    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + '/auth/login',
      { email: email }
    )

    if (data && data?.status) {
      res.status(200).json({
        status: true,
        message: 'Email sent successfully',
      })
    } else {
      res.status(200).json({
        status: false,
        message: 'Internal Error',
      })
    }
  } catch (err) {
    res.status(500).json({ status: false, message: 'Something went wrong' })
  }
}
