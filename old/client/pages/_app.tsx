import { ApolloProvider } from '@apollo/client';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from "next-auth/react";
import NextProgress from 'next-progress';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apollo from '../lib/apollo';
import '../styles/globals.css';

function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: any) {
    return (
        <SessionProvider session={session}>
            <ApolloProvider client={apollo}>
                <Head>
                    <title>Overclock Studios PaaS</title>
                </Head>
                <NextThemesProvider
                    defaultTheme="system"
                    attribute="class"
                >
                    <NextUIProvider>
                        <Component {...pageProps} />
                        <NextProgress />
                    </NextUIProvider>
                </NextThemesProvider>
                <ToastContainer />
            </ApolloProvider>
        </SessionProvider>
    );
}

export default MyApp;
