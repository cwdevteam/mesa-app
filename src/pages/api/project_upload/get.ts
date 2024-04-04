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
      process.env.NEXT_PUBLIC_BASE_URL + '/project_upload/' + id,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data) {
      res.status(200).json({
        media: data.media,
      })
    }
  } catch (err: any) {
    res.status(500).send('Something went wrong!')
  }
}
