import { getCookie } from '@/lib/utils'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

type InviteChoiceProps = {
  state: 'accept' | 'reject'
  token: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { state, token }: InviteChoiceProps = req.body
    const session = getCookie(req)
    const { data } = await axios.put(
      process.env.NEXT_PUBLIC_BASE_URL + '/project_invitation/autosign',
      { state: state, token: token },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data && data.status) {
      res.status(200).json({
        token: data.token,
        id: data.id,
        status: true,
      })
    }
  } catch (err: any) {
    if (err.response?.data) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send('Something went wrong!')
    }
  }
}
