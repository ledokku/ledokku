import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { createGlobalStyle } from 'styled-components';
import {
  split,
  from,
  HttpLink,
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import './generated/index.css';
import { config } from './config';
import { AuthProvider } from './modules/auth/AuthContext';
import { Router } from './Router';

// TODO remove this after chakra migration is done
const GlobalStyle = createGlobalStyle`
  body {
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
  }
`;

const httpLink = new HttpLink({
  uri: `${config.serverUrl}/graphql`,
});

const wsLink = new WebSocketLink({
  uri: `${config.serverWsUrl}/graphql`,
  options: {
    reconnect: true,
    connectionParams: () => {
      return {
        token: localStorage.getItem('accessToken'),
      };
    },
  },
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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, splitLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ChakraProvider>
        <AuthProvider>
          <GlobalStyle />
          <Router />
        </AuthProvider>
      </ChakraProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
