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
      process.env.NEXT_PUBLIC_BASE_URL + '/project/' + id,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
        data: {
          project_id: id,
        },
      }
    )

    if (data && data.project) {
      res.status(200).json({
        project: data.project,
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
