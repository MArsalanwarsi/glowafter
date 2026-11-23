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
  title: 'glowafter — Cinematic Theme Transitions for React & Next.js',
  description:
    'Cinematic, stutter-free theme transition animations for React & Next.js powered by native View Transitions API with GSAP canvas fallback. 17 procedural presets, zero-stutter mobile touch, and custom GIF alpha masking.',
  keywords: [
    'glowafter',
    'theme transition',
    'view transitions api',
    'react theme animation',
    'next-themes',
    'shadcn',
    'dark mode animation',
    'light mode animation',
    'react 19',
    'nextjs 16',
  ],
  authors: [{ name: 'Muhammad Arsalan Warsi', url: 'https://github.com/MArsalanwarsi' }],
  icons: {
    icon: '/logo.svg',
  },
  openGraph: {
    title: 'glowafter — Cinematic Theme Transitions for React in JS & TS',
    description:
      'Cinematic, stutter-free theme transition animations for React powered by View Transitions API with GSAP canvas fallback.',
    url: 'https://glowafter.vercel.app',
    siteName: 'glowafter',
    images: [
      {
        url: '/linkedin-banner.png',
        width: 1200,
        height: 675,
        alt: 'glowafter — Cinematic Theme Transitions for React',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'glowafter — Cinematic Theme Transitions for React',
    description:
      'Cinematic, stutter-free theme transition animations for React powered by View Transitions API with GSAP canvas fallback.',
    images: ['/linkedin-banner.png'],
  },
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
