import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
// import { from } from 'apollo-link';
// import { createHttpLink } from 'apollo-link-http';
// import { setContext } from '@apollo/link-context';
// import { onError } from '@apollo/link-error';
// import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import './generated/index.css';
import { config } from './config';
import { AuthProvider } from './modules/auth/AuthContext';
import { Router } from './Router';
import {
  split,
  HttpLink,
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

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
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true,
  },
});

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('accessToken');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// });

// const errorLink = onError(({ graphQLErrors }) => {
//   if (graphQLErrors) {
//     const error = graphQLErrors[0];
//     /**
//      * If we get the "Unauthorized" message from the server
//      * it means the token is not valid anymore so we log out the user
//      */
//     if (error.message === 'Unauthorized') {
//       localStorage.removeItem('accessToken');
//       window.location.href = '/';
//     }
//   }
// });

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

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <GlobalStyle />
        <Router />
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
