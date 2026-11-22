import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProviders } from '@/components/theme-providers'

const inter = Inter({ subsets: ['latin'] })
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'glowafter — Cinematic Theme Transitions',
  description:
    'Cinematic, stutter-free theme transition animations for React & Next.js. Powered by the View Transitions API with GSAP canvas fallback.',
}
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className + ' ' + serif.variable}>
      <body>
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  )
}
