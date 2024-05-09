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
      process.env.NEXT_PUBLIC_BASE_URL + '/note/' + id,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data && data.notes) {
      res.status(200).json({
        notes: data.notes,
      })
    }
  } catch (err) {
    res.status(500).send('Something went wrong!')
  }
}
