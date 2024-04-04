import ThemeProvider from '@/context/ThemeProvider'
import MediaProvider from '@/context/MediaContext'
import AuthProvider from '@/context/AuthProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <MediaProvider>{children}</MediaProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
