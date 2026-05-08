import type { Metadata } from 'next'
import { Space_Mono, Syne } from 'next/font/google'
import './globals.css'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pangki.dev'),
  title: {
    default: 'Pangki — Full Stack Developer | pangki.dev',
    template: '%s | Pangki',
  },
  description: 'Pangki (Supawat Khaithong) — Full Stack Developer specializing in Next.js, React, and TypeScript. Building fast, scalable web applications. View projects and get in touch.',
  keywords: [
    'Pangki', 'pangki.dev', 'Pangki developer', 'Pangki Full Stack',
    'Supawat Khaithong', 'Full Stack Developer', 'Web Developer',
    'Next.js developer', 'React developer', 'TypeScript developer',
    'freelance developer', 'Thailand developer', 'Khon Kaen University',
  ],
  authors: [{ name: 'Pangki', url: 'https://pangki.dev' }],
  creator: 'Pangki',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pangki.dev',
    siteName: 'Pangki — Full Stack Developer',
    title: 'Pangki — Full Stack Developer',
    description: 'Full Stack Developer specializing in Next.js, React, and TypeScript. Building fast, scalable web applications.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pangki — Full Stack Developer',
    description: 'Full Stack Developer specializing in Next.js, React, and TypeScript. Building fast, scalable web applications.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://pangki.dev',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  )
}
