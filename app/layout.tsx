import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Job Application Form',
  description: 'A simple job application form',
  icons: {
    icon: 'https://logo.clearbit.com/paraform.com',
    apple: 'https://logo.clearbit.com/paraform.com',
  },
  openGraph: {
    title: 'Job Application Form',
    description: 'A simple job application form',
    images: [{
      url: 'https://logo.clearbit.com/paraform.com',
      width: 800,
      height: 600,
      alt: 'Paraform Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Application Form',
    description: 'A simple job application form',
    images: ['https://logo.clearbit.com/paraform.com'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
