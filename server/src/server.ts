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
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import * as http from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { authChecker } from './config/auth_checker';
import { ContextFactory } from './config/context_factory';
import { IS_PRODUCTION, PORT } from './constants';
import { MainController } from './controllers/main.controller';
import { WebhookController } from './controllers/webhook.controller';
import { pubsub } from './index.old';
import { DokkuContext } from './data/models/dokku_context';
import { synchroniseServerQueue } from './queues/synchroniseServer';
import { startSmeeClient } from './smeeClient';

@Configuration({
  port: PORT,
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
      formatError: (err: any) => {
        if (!IS_PRODUCTION) {
          $log.error(err);
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
  private typegql!: TypeGraphQLService;

  @Inject()
  httpServer!: http.Server;

  $beforeRoutesInit(): void | Promise<void> {
    this.app
      .use(express.json({ limit: '1mb' }))
      .use(express.urlencoded({ limit: '1mb', extended: true }));
  }

  $onReady(): void | Promise<any> {
    const schema = this.typegql.getSchema('main');

    SubscriptionServer.create(
      {
        schema,
        execute,
        subscribe,
        onConnect: async (connectionParams: any) => {
          return ContextFactory.createFromWS(connectionParams);
        },
      },
      {
        server: this.httpServer,
      }
    );

    if (!IS_PRODUCTION) {
      startSmeeClient();
    }

    synchroniseServerQueue.add('synchronise-server', {});
  }
}

registerProvider({
  provide: PubSub,
  useValue: pubsub,
});

registerProvider({
  provide: PrismaClient,
  useValue: new PrismaClient(),
});
