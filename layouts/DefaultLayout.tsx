import React from 'react';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';

import { DefaultTheme } from '../ui/themes/DefaultTheme';
import { GlobalStyle } from '../ui/GlobalStyle';

export interface DefaultLayoutProps {
  //
}

export const DefaultLayout = ({ children }) => (
  <ThemeProvider theme={DefaultTheme}>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600;1,700;1,900&display=swap"
        rel="stylesheet"
        as="font"
      />
    </Head>

    <GlobalStyle />

    {children}
  </ThemeProvider>
);
