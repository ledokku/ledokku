import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { SERVER_URL, SERVER_WS_URL } from '../constants';

const httpLink = new HttpLink({
  uri: `${SERVER_URL}/graphql`,
});

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: `${SERVER_WS_URL}/graphql`,
          connectionParams: () => {
            return {
              token: localStorage.getItem('accessToken'),
            };
          },
        })
      )
    : null;

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
    if (error.message.includes('Unauthorized')) {
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
  }
});

const splitLink =
  typeof window !== 'undefined' && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

export default new ApolloClient({
  link: from([authLink, errorLink, splitLink]),
  cache: new InMemoryCache(),
});
