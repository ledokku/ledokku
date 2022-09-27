import { PlatformApplication } from '@tsed/common';
import { Configuration, Inject } from '@tsed/di';
import '@tsed/platform-express';
import '@tsed/typegraphql';
import { ApolloServer } from 'apollo-server-express';
import 'reflect-metadata';
import { PORT } from './constants';
import { stitchedSchema } from '.';

@Configuration({
  port: PORT,
  rootDir: __dirname,
  acceptMimes: ['application/json'],
  typegraphql: {
    default: <any>{
      server: (config) =>
        new ApolloServer({
          ...config,
          schema: stitchedSchema,
        }),
      path: '/graphql',
      buildSchemaOptions: {
        dateScalarMode: 'isoDate',
      },
      tracing: true,
    },
  },
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  //   public $beforeRoutesInit(): void | Promise<void> {}
}
