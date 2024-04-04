import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { decodeToken } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/context/AuthProvider'

export default function Invite() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { query }: any = useRouter()
  const [invite, setInvite] = useState<any>({
    invitee: '',
    from: '',
    to: '',
  })

  useEffect(() => {
    if (query.token_hash) {
      const result: any = decodeToken(query.token_hash)

      setInvite({
        invitee: result.invitee,
        from: result.from,
        to: result.to,
      })
    }
  }, [query])

  const handleSubmit = async (state: string) => {
    try {
      if (!user.email) {
        toast({
          title: 'Warn',
          description: 'Please sign in',
          variant: 'destructive',
        })
        router.push('/')
        return
      }
      const { data } = await axios.post(
        '/api/project_invitation/choicebytoken',
        {
          state: state,
          token: query.token_hash,
        }
      )

      if (data && data.status) {
        toast({
          title: 'Success',
          description: 'Accepted Invitation',
          variant: 'default',
        })
        router.push(`/project/${data.id}`)
      }
    } catch (err: any) {
      if (err.response?.data) {
        toast({
          title: 'Error',
          description: err.response.data,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <main className="container py-10 h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5">
        <Image
          src="https://d34u8crftukxnk.cloudfront.net/slackpress/prod/sites/6/M2A2H%402x.jpg?d=500x500&f=inside"
          alt=""
          width={150}
          height={150}
          className="rounded-full object-cover w-[150px] h-[150px] bg-cyan-100"
        />
        <div className="text-2xl font-bold text-center">
          <a href={`mailto:${invite.from}`} className="text-blue-700">
            {invite.invitee}
          </a>{' '}
          invited you to collaborate
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            className="bg-green-600 px-4 py-3 hover:bg-green-700"
            onClick={() => handleSubmit('accept')}
          >
            Accept invitation
          </Button>
          <Button
            className="bg-zinc-100 text-black border-2 border-zinc-200 hover:bg-zinc-200"
            onClick={() => handleSubmit('accept')}
          >
            Decline
          </Button>
        </div>
        <div className="text-center">
          Is this user sending spam or malicious content? You can{' '}
          <a href={`mailto:${invite.from}`} className="text-blue-800">
            block {invite.invitee}
          </a>
        </div>
      </div>
    </main>
  )
}
