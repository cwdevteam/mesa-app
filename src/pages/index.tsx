import { Button } from '@/components/ui/button'
import UserAuthDialog from '@/components/UserAuthDialog'
import { useIntl } from 'react-intl'

export default function Home() {
  const intl = useIntl()

  return (
    <main className="grid gap-6 sm:gap-12 md:gap-24">
      <div className="grid grid-rows-[1fr_auto_2fr]">
        <section className="row-start-2 grid gap-4 place-items-center container w-fit p-8">
          <h1 className="text-4xl font-medium tracking-tight">
            {intl.formatMessage({ id: 'page.welcome' })}
          </h1>
          <UserAuthDialog>
            <Button className="text-md px-8 w-full">Sign in</Button>
          </UserAuthDialog>
          {!process.env.NEXT_PUBLIC_SIGNUPS_OPEN && (
            <p className="text-sm text-muted-foreground text-center max-w-[18em]">
              Access is currently limited to our alpha release partners.
              {process.env.NEXT_PUBLIC_ACCESS_FORM_URL && (
                <>
                  <br />
                  <br />
                  <a
                    href={process.env.NEXT_PUBLIC_ACCESS_FORM_URL}
                    className="underline underline-offset-4 hover:text-primary"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Sign up for early access
                  </a>
                </>
              )}
            </p>
          )}
        </section>
      </div>
    </main>
  )
}
