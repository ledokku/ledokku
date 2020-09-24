import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  from,
  ApolloProvider,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import './generated/index.css';
import { config } from './config';
import { AuthProvider } from './modules/auth/AuthContext';
import { Router } from './Router';

const GlobalStyle = createGlobalStyle`
  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
  }
`;

const httpLink = createHttpLink({
  uri: `${config.serverUrl}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    const error = graphQLErrors[0];
    /**
     * If we get the "Unauthorized" message from the server
     * it means the token is not valid anymore so we log out the user
     */
    if (error.message === 'Unauthorized') {
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
  }
});

const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <GlobalStyle />
        <Router />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
