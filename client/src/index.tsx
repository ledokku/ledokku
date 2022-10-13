import {
  ApolloClient, ApolloProvider, from,
  HttpLink, InMemoryCache, split
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './generated/index.css'; // 1
import { config } from './config'; // 2
import { AuthProvider } from './modules/auth/AuthContext'; // 3
import { Router } from './Router'; // 4
import { createTheme, NextUIProvider } from '@nextui-org/react'; //5
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDarkMode from 'use-dark-mode';

const httpLink = new HttpLink({
  uri: `${config.serverUrl}/graphql`,
});

const wsLink = new GraphQLWsLink(createClient({
  url: `${config.serverWsUrl}/graphql`,
  connectionParams: () => {
    return {
      token: localStorage.getItem('accessToken'),
    };
  },

}));

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

const lightTheme = createTheme({
  type: 'light',

})

const darkTheme = createTheme({
  type: 'dark',

})

const App = () => {
  const darkMode = useDarkMode(false);

  return (<React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <NextUIProvider theme={darkMode.value ? darkTheme : lightTheme}>
        <AuthProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AuthProvider>
        <ToastContainer />
      </NextUIProvider>
    </ApolloProvider>
  </React.StrictMode>)
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
