import Link from 'next/link'
import { useRouter } from 'next/router'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Logo } from '@/components/Logo'
import { UserNav } from '@/components/layouts/UserNav'
import { useAuth } from '@/context/AuthProvider'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'

export default function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, setUser } = useAuth()

  const logout = async () => {
    try {
      const { data } = await axios.post('/api/auth/logout')
      if (data && data.status) {
        setUser({
          id: '',
          email: '',
          username: '',
        })
        router.push('/')
      }
    } catch (err) {
      toast({
        title: 'Warn',
        description: 'Something went wrong.',
        variant: 'destructive',
      })
    }
  }

  return (
    <header className="flex border-b border-foreground/20">
      <div className="flex container mx-auto py-4">
        <Link className="flex items-center gap-2" href="/">
          <Logo className="h-6 w-auto" />
        </Link>
        <div className="flex gap-4 ml-auto">
          <ThemeToggle />
          {user.email && <UserNav user={user} logout={logout} />}
        </div>
      </div>
    </header>
  )
}
