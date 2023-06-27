import { twMerge } from 'tailwind-merge'
import './globals.css'
import { Outfit } from 'next/font/google'
import ThemeProvider from '@/lib/ThemeProvider'
import ReactQueryProvider from '@/lib/ReactQueryProvider'
import Topbar from './Topbar'

const fontFamily = Outfit({ subsets: ['latin'], weight: 'variable' })

export const metadata = {
  title: 'ImaginAI',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={twMerge(
          fontFamily.className,
          'h-full dark:bg-gray-950 dark:text-white'
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReactQueryProvider>
            <Topbar>{children}</Topbar>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
