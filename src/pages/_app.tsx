import '@/styles/globals.css'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { IntlProvider } from 'react-intl'

import Providers from '@/context/Providers'
import Header from '@/components/layouts/Header'

import { Toaster } from '@/components/ui/toaster'
import { ToastQuery } from '@/components/ToastQuery'
import MediaController from '@/components/GlobalAudioPlayer/MediaController'

import en from '@/lang/en.json'
import es from '@/lang/es.json'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const messages: any = {
  en,
  es,
}

export default function App({ Component, pageProps }: AppProps) {
  const { locale } = useRouter()

  return (
    <IntlProvider locale={locale || 'en'} messages={messages[locale || 'en']}>
      <Providers>
        <div
          className={clsx(
            'grid grid-rows-[auto_minmax(0,1fr)] min-h-screen h-fit',
            inter.className
          )}
        >
          <Header />
          <Component {...pageProps} />

          <MediaController />
          <ToastQuery />
          <Toaster />
        </div>
      </Providers>
    </IntlProvider>
  )
}
