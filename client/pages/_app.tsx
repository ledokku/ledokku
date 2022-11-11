import '../styles/globals.css';
import { AuthProvider } from '../ui/modules/auth/AuthContext';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ApolloProvider } from '@apollo/client';
import apollo from '../lib/apollo';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import 'react-toastify/dist/ReactToastify.css';

const lightTheme = createTheme({
    type: 'light',
});

const darkTheme = createTheme({
    type: 'dark',
});

function MyApp({ Component, pageProps }: any) {
    return (
        <ApolloProvider client={apollo}>
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
        </ApolloProvider>
    );
}

export default MyApp;
