'use client'

import { useFormStatus } from 'react-dom'

import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/button'

export default function SignOutButtonFormChildren() {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type="submit">
      {pending ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        'Continue with Email'
      )}
    </Button>
  )
}
