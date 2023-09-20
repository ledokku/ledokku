'use client'

import apollo from '@/lib/apollo'
import { ApolloProvider } from '@apollo/client'
import { NextUIProvider } from '@nextui-org/react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import NextProgress from 'next-progress'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'


export function Providers({
  children,
  session
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider session={session}>
            <ApolloProvider client={apollo}>
                <NextThemesProvider
                    defaultTheme="system"
                    attribute="class"
                >
                    <NextUIProvider>
                        {children}
                        <NextProgress />
                    </NextUIProvider>
                </NextThemesProvider>
                <Toaster position='top-right' />
            </ApolloProvider>
        </SessionProvider>
  )
}