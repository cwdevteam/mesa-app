import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from '@/lib/utils'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = getCookie(req)
    const { username, firstName, lastName, id } = req.body

    const { data } = await axios.put(
      process.env.NEXT_PUBLIC_BASE_URL + '/user/' + id,
      {
        username: username.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: session,
        },
      }
    )

    if (data && data.user) {
      res.status(200).json({
        user: data.user,
      })
    }
  } catch (err: any) {
    if (err.response.data) {
      res.status(405).send(err.response.data)
    } else {
      res.status(500).send('Something went wrong!')
    }
  }
}
