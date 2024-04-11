import { getCookie } from '@/lib/utils'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type NewProps = {
  data: {
    id: string
    name: string
    desc: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data }: NewProps = req.body
    const session = getCookie(req)

    const result = await axios.put(
      process.env.NEXT_PUBLIC_BASE_URL + '/project/' + data.id,
      { title: data.name, description: data.desc },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (result.data && result.data.status) {
      res.status(200).json({
        status: true,
      })
    }
  } catch (err: any) {
    res.status(500).send('Something went wrong!')
  }
}
