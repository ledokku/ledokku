import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession, signOut } from "next-auth/react";
import { SERVER_URL, SERVER_WS_URL } from "../constants";

const httpLink = new HttpLink({
  uri: `${SERVER_URL}/graphql`,
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${SERVER_WS_URL}/graphql`,
          connectionParams: async () => {
            const session = await getSession();
            return {
              token: session?.accessToken,
            };
          },
        })
      )
    : null;

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  return {
    headers: {
      ...headers,
      authorization: session?.accessToken
        ? `Bearer ${session?.accessToken}`
        : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors }) => {
  console.error("Error from server:", JSON.stringify(graphQLErrors, null, 2));
  if (graphQLErrors) {
    const error = graphQLErrors[0];

    if (error.message.includes("Unauthorized")) {
      signOut({ callbackUrl: "/", redirect: true });
    }
  }
});

const splitLink =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const apollo = new ApolloClient({
  link: from([authLink, errorLink, splitLink]),
  cache: new InMemoryCache(),
});

export default apollo;
