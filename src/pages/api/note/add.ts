import { getCookie } from '@/lib/utils'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type NewProps = {
  type: string
  content: string
  projectId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { content, type, projectId }: NewProps = req.body
    const session = getCookie(req)

    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + '/note/' + projectId,
      { type: type, content: content },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data && data.status) {
      res.status(200).json({
        status: true,
      })
    }
  } catch (err: any) {
    res.status(500).send('Something went wrong!')
  }
}
