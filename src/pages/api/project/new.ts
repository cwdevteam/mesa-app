import { getCookie } from '@/lib/utils'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type NewProps = {
  data: {
    title: string
    description: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data }: NewProps = req.body
    const session = getCookie(req)

    const result = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + '/project',
      { title: data.title, description: data.description },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (result.data && result.data.projectId) {
      res.status(200).json({
        message: 'Project creaeted successfully!',
        projectId: result.data.projectId,
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
