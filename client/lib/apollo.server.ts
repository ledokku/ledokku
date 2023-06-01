import { GraphQLClient } from 'graphql-request';
import { SERVER_URL } from '../constants';
import { getSdk } from '../generated/graphql.server';

const client = new GraphQLClient(`${SERVER_URL}/graphql`);

export const serverClient = getSdk(client);
