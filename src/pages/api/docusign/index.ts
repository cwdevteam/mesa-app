import { getCookie } from '@/lib/utils'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const payload = req.body
    if (payload && payload.event) {
      const session = getCookie(req)
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + '/contract/notify',
        { data: payload },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: session,
          },
        }
      )
    }

    res.status(200).json({ message: 'Webhook received and processed' })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
