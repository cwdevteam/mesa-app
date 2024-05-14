import { getCookie } from '@/lib/utils'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type NewProps = {
  projectId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { projectId }: NewProps = req.body
    const session = getCookie(req)
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + '/contract',
      { projectId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    );

    if (response && response.status) {
      res.status(200).json({
        status: true,
        contractId: response.data.contractId,
        contractTime: response.data.contractTime,
      })
    }
  } catch (err: any) {
    res.status(500).send('Something went wrong!')
  }
}
