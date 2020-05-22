import React from 'react';
import { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import '../styles/index.css';
import { AuthProvider } from '../modules/auth/AuthContext';

const GlobalStyle = createGlobalStyle`
  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;

    background:
      linear-gradient(-45deg, white, transparent, white),
      radial-gradient(rgba(0, 0, 0, 0.1) 1.25px, #FFF 1.25px);
    background-size: cover, 18px 18px;
  }
`;

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </React.Fragment>
  );
};

export default MyApp;
