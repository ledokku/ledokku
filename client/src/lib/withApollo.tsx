import React from 'react';
import withApollo from 'next-with-apollo';
import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from '@apollo/react-hooks';
import { config } from '../config';

// TODO delete this file after cra migration
export default withApollo(
  ({ initialState }) => {
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

    const client = new ApolloClient({
      link: from([authLink, errorLink, httpLink]),
      cache: new InMemoryCache().restore(initialState || {}),
    });

    return client;
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  }
);
