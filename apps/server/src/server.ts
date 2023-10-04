import { PrismaClient } from '@prisma/client';
import {
  $log,
  BeforeRoutesInit,
  Logger,
  OnReady,
  PlatformApplication,
} from '@tsed/common';
import { Configuration, Inject, registerProvider } from '@tsed/di';
import '@tsed/platform-express';
import '@tsed/typegraphql';
import { TypeGraphQLService } from '@tsed/typegraphql';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { ExpressContext } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { execute, GraphQLError, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import * as http from 'http';
import { Server as WebSocketServer } from 'ws';
import './config/appender';
import { authChecker } from './config/auth_checker';
import { ContextFactory } from './config/context_factory';
import { CORS_ORIGIN, IS_PRODUCTION, PORT } from './constants';
import { WebhookController } from './controllers/webhook.controller';
import prisma from './lib/prisma';
import * as modules from './modules';
import { SyncServerQueue } from './queues/sync_server.queue';
import { startSmeeClient } from './smeeClient';

export const pubsub = new PubSub();

registerProvider({
  provide: PubSub,
  useValue: pubsub,
});

registerProvider({
  provide: PrismaClient,
  useValue: prisma,
});

@Configuration({
  port: PORT,
  logger: {
    logRequest: false,
  },
  rootDir: __dirname,
  acceptMimes: ['application/json'],
  mount: {
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
      introspection: true,
      resolvers: Object.values(modules) as any,
      serverConfig: {
        plugins: [ApolloServerPluginInlineTrace()],
      },
      context: (expressContext: ExpressContext) =>
        ContextFactory.createFromHTTP(expressContext.req as any),
      formatError: (err: GraphQLError) => {
        $log.error(err.message, err.path, err.stack, err.extensions);

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
  logger: Logger;

  @Inject()
  syncServerQueue: SyncServerQueue;

  async $beforeRoutesInit(): Promise<void> {
    this.app
      .use(
        cors({
          origin: CORS_ORIGIN,
        })
      )
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

    this.logger.appenders.set('std-log', {
      type: 'publisher_appender',
      level: ['debug', 'info', 'trace', 'error', 'warning'],
    });
  }
}
