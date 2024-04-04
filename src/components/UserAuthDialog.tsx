import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'
import EmailAuthForm from '@/components/Forms/EmailAuthForm'
import SocialAuthForm from '@/components/Forms/SocialAuthForm'

type UserAuthDialogProps = React.HTMLAttributes<HTMLDivElement>

export default function UserAuthDialog({
  children,
  className,
  ...props
}: UserAuthDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn('grid gap-8 max-w-sm px-8 py-16', className)}
        {...props}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-center">
            {process.env.NEXT_PUBLIC_SIGNUPS_OPEN
              ? 'Sign-in or create an account'
              : 'Sign-in'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            Enter your email below to continue
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-2 max-w-full">
            <EmailAuthForm />
          </div>
          {process.env.NEXT_PUBLIC_OAUTH_PROVIDERS && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid gap-1">
                <SocialAuthForm />
              </div>
            </>
          )}
        </div>
        {(process.env.NEXT_PUBLIC_TOS_URL ||
          process.env.NEXT_PUBLIC_PP_URL) && (
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            {process.env.NEXT_PUBLIC_TOS_URL && (
              <a
                href={process.env.NEXT_PUBLIC_TOS_URL}
                className="underline underline-offset-4 hover:text-primary"
                rel="noreferrer noopener"
                target="_blank"
              >
                Terms of Service
              </a>
            )}
            {process.env.NEXT_PUBLIC_TOS_URL &&
              process.env.NEXT_PUBLIC_PP_URL && <> and </>}
            {process.env.NEXT_PUBLIC_PP_URL && (
              <a
                href={process.env.NEXT_PUBLIC_PP_URL}
                className="underline underline-offset-4 hover:text-primary"
                rel="noreferrer noopener"
                target="_blank"
              >
                Privacy Policy
              </a>
            )}
            .
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
