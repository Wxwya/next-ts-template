import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import Version from '@/components/Version'
import './globals.css'
export const metadata: Metadata = {
  title: {
    default: 'next-ts-templte',
    template: 'next-ts-templte - %s',
    
  },
  description: 'next-ts-templte',
}
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cn" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <div className='global_modal_container'></div>
          <Toaster />
        </ThemeProvider>
        <Version />
      </body>
    </html>
  )
}
