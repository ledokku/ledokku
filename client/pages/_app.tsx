import { ApolloProvider } from '@apollo/client';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apollo from '../lib/apollo';
import '../styles/globals.css';
import { AuthProvider } from '../ui/modules/auth/AuthContext';

const lightTheme = createTheme({
    type: 'light',
});

const darkTheme = createTheme({
    type: 'dark',
});

function MyApp({ Component, pageProps }: any) {
    return (
        <ApolloProvider client={apollo}>
            <Head>
                <title>Overclock Studios PaaS</title>
            </Head>
            <AuthProvider>
                <NextThemesProvider
                    defaultTheme="system"
                    attribute="class"
                    value={{
                        light: lightTheme.className,
                        dark: darkTheme.className,
                    }}
                >
                    <NextUIProvider>
                        <Component {...pageProps} />
                    </NextUIProvider>
                </NextThemesProvider>
            </AuthProvider>
            <ToastContainer />
        </ApolloProvider>
    );
}

export default MyApp;
