import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'A simple Next.js blog',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
