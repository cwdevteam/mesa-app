import { cookies } from 'next/headers'
import { useAuth } from '@/context/AuthProvider'

import SignOutButtonFormChildren from './Button.client'

export async function SignOutButton() {
  const { user } = useAuth()

  if (user.email) {
    return (
      <div className="flex items-center gap-4">
        Hey, {user.email}!
        <SignOutButtonFormChildren />
      </div>
    )
  }
}
