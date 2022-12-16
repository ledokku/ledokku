'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { createTheme, CssBaseline, NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';

const lightTheme = createTheme({
    type: 'light',
});

const darkTheme = createTheme({
    type: 'dark',
});

export default function Providers({ children }: {
    children: React.ReactNode
}) {
    useServerInsertedHTML(() => {
        return <>{CssBaseline.flush()}</>
    })

    return (
        <>
            <NextThemesProvider
                defaultTheme="system"
                attribute="class"
                value={{
                    light: lightTheme.className,
                    dark: darkTheme.className,
                }}
            >
                <AuthProvider>
                    <NextUIProvider>
                        {children}
                    </NextUIProvider>
                </AuthProvider>
            </NextThemesProvider>
            <ToastContainer />
        </>
    )
}