import { PrismaClient } from '@prisma/client';
import {
  $log,
  BeforeRoutesInit,
  OnReady,
  PlatformApplication,
} from '@tsed/common';
import { Configuration, Inject, registerProvider } from '@tsed/di';
import '@tsed/platform-express';
import '@tsed/typegraphql';
import { TypeGraphQLService } from '@tsed/typegraphql';
import { ExpressContext } from 'apollo-server-express';
import express from 'express';
import { execute, GraphQLError, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import * as http from 'http';
import { Server as WebSocketServer } from 'ws';
import { authChecker } from './config/auth_checker';
import { ContextFactory } from './config/context_factory';
import { IS_PRODUCTION, PORT } from './constants';
import { MainController } from './controllers/main.controller';
import { WebhookController } from './controllers/webhook.controller';
import { DokkuContext } from './data/models/dokku_context';
import { SubscriptionTopics } from './data/models/subscription_topics';
import { SyncServerQueue } from './queues/sync_server.queue';
import { startSmeeClient } from './smeeClient';

const pubsub = new PubSub();

(pubsub as any).secretId = 123;

registerProvider({
  provide: PubSub,
  useValue: pubsub,
});

registerProvider({
  provide: PrismaClient,
  useValue: new PrismaClient(),
});

@Configuration({
  port: PORT,
  logger: {
    logRequest: false,
  },
  rootDir: __dirname,
  acceptMimes: ['application/json'],
  componentsScan: [`${__dirname}/**/*.resolver.{ts,js}`],
  mount: {
    '/': [MainController],
    '/api': [WebhookController],
  },
  typegraphql: {
    default: {
      path: '/graphql',
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
        authChecker,
        pubSub: pubsub,
      },
      context: (expressContext: ExpressContext) =>
        ContextFactory.createFromHTTP(expressContext.req),
      formatError: (err: GraphQLError) => {
        if (!IS_PRODUCTION) {
          $log.error(err);
        }

        if (err.message.startsWith('!     ')) {
          return {
            message: err.message.replace(/^!\s*/, ''),
            extensions: err.extensions,
            locations: err.locations,
            path: err.path,
          };
        }
        return err;
      },
      formatResponse: (response, requestContext) => {
        if ('sshContext' in requestContext.context) {
          (requestContext.context as DokkuContext).sshContext.connection.dispose();
        }

        return response;
      },
    },
  },
})
export class Server implements BeforeRoutesInit, OnReady {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  @Inject()
  private typegql: TypeGraphQLService;

  @Inject()
  httpServer: http.Server;

  @Inject()
  syncServerQueue: SyncServerQueue;

  $beforeRoutesInit(): void | Promise<void> {
    this.app
      .use(express.json({ limit: '1mb' }))
      .use(express.urlencoded({ limit: '1mb', extended: true }));
  }

  async $onReady(): Promise<void | Promise<any>> {
    const schema = this.typegql.getSchema('default');

    const wsServer = new WebSocketServer({
      server: this.httpServer,
      path: '/graphql',
    });

    useServer(
      {
        schema,
        subscribe,
        execute,
        context: (ctx) => ContextFactory.createFromWS(ctx.connectionParams),
      },
      wsServer
    );

    if (!IS_PRODUCTION) {
      startSmeeClient();
    }

    await this.syncServerQueue.add();

    pubsub.publish(SubscriptionTopics.APP_CREATED, 'holis');
  }
}
