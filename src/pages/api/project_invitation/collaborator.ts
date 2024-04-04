import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from '@/lib/utils'
import axios from 'axios'

type CollaboratorInterface = {
  state: {
    user_email: string
    description: string
    name: string
  }
  id: string
  owner: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = getCookie(req)
    const { state, id, owner }: CollaboratorInterface = req.body

    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_BASE_URL + '/project_invitation/collaborator',
      {
        project_id: id,
        name: state.name,
        email: state.user_email,
        description: state.description,
        owner: owner,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data && data.status) {
      return res.status(200).json({
        to: state.user_email,
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
