import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from '@/lib/utils'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = getCookie(req)
    const { id } = req.body

    const { data } = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + '/user/' + id,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
        data: {},
      }
    )

    if (data && data.user) {
      res.status(200).json({
        data: data.user,
      })
    }
  } catch (err: any) {
    if (err.response?.data) {
      res.status(403).send(err.response.data)
    } else {
      res.status(500).send('Something went wrong!')
    }
  }
}
