import { getCookie } from '@/lib/utils'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type NewProps = {
  contractId: string | null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { contractId }: NewProps = req.body
    const session = getCookie(req)
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BASE_URL + '/contract/' + contractId,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (response && response.status) {
      res.status(200).json({
        status: true,
        document: response.data.document
      })
    }
  } catch (err: any) {
    res.status(500).send('Something went wrong!')
  }
}
