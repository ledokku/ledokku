import type { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import './globals.css'
import { Providers } from './providers'
import { authOptions } from './api/auth/[...nextauth]/route'

export const metadata: Metadata = {
  title: 'Overclock Studios PaaS',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
