import '@/styles/globals.css'
import clsx from 'clsx'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

import Providers from '@/context/Providers'
import Header from '@/components/Header'

import { Toaster } from '@/components/ui/toaster'
import { ToastQuery } from '@/components/ToastQuery'
import MediaController from '@/components/GlobalAudioPlayer/MediaController'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
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
  )
}
