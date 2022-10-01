import dotenv from 'dotenv';
import { PubSub } from 'graphql-subscriptions';
import 'reflect-metadata';
dotenv.config();

export const pubsub = new PubSub();

/*




http.listen({ port: PORT }, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  );

  /**
   * In development we use the smee proxy to forward the external calls to our app
   *
  if (process.env.NODE_ENV !== 'production') {
    require('./smeeClient');
  }

  // When the server boot we start the synchronisation with dokku
  synchroniseServerQueue.add('synchronise-server', {});
});*/
