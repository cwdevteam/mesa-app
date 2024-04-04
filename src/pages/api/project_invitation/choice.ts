import { getCookie } from '@/lib/utils'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type InviteChoiceProps = {
  state: 'accept' | 'reject'
  inviteId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { state, inviteId }: InviteChoiceProps = req.body
    const session = getCookie(req)
    const { data } = await axios.put(
      process.env.NEXT_PUBLIC_BASE_URL + '/project_invitation/' + inviteId,
      { state: state },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data && data.status) {
      res.status(200).json({
        id: data.id,
        status: true,
      })
    }
  } catch (err: any) {
    res.status(500).send('Something went wrong!')
  }
}
