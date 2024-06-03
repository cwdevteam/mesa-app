import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from '@/lib/utils'
import axios from 'axios'

type MesaInterface = {
  state: {
    id: string
    contract_type: string
    user_role: string
    user_bps: number
  }
  projectUserId: string
  projectId: string
  currentUsername: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = getCookie(req)
    const { state, projectUserId, projectId, currentUsername }: MesaInterface = req.body

    const { data } = await axios.put(
      process.env.NEXT_PUBLIC_BASE_URL + '/project_user_role/' + state.id,
      {
        projectId: projectId,
        currentUsername: currentUsername,
        projectUserId: projectUserId,
        role: state.user_role,
        type: state.contract_type,
        bps: state.user_bps,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data && data.status) {
      return res.json({
        status: true,
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
