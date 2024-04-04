import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Icons } from '@/components/Icons'
import { useAuth } from '@/context/AuthProvider'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'

export default function Confrim() {
  const router = useRouter()
  const { query }: any = useRouter()
  const { setUser } = useAuth()

  useEffect(() => {
    if (query.token_hash) {
      handleAuth(query.token_hash)
    }
  }, [query])

  const handleAuth = async (tokenHash: string) => {
    try {
      const { data } = await axios.put('/api/auth/confirm', {
        token: tokenHash,
      })

      if (data && data.status) {
        setUser({
          id: data.userData.id,
          email: data.userData.email,
          username: data.userData.username,
        })
        router.push('/dashboard')
      } else router.push('/')
    } catch (err: any) {
      toast({
        title: 'Error',
        description: !err.response.data?.status && err.response.data?.message,
        variant: 'destructive',
      })
      router.push('/')
    }
  }

  return (
    <main className="container py-10 h-full flex items-center justify-center">
      <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
    </main>
  )
}
