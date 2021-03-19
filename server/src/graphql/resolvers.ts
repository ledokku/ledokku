import { prisma } from '../prisma';
import { App, Database } from '../generated/graphql';

export const customResolvers = {
  App: {
    databases: async (app: App) => {
      const databases = await prisma.app
        .findUnique({
          where: {
            id: app.id,
          },
        })
        .databases();

      return databases;
    },
    appMetaGithub: async (app: App) => {
      const appMetaGithub = await prisma.app
        .findUnique({
          where: {
            id: app.id,
          },
        })
        .AppMetaGithub();

      return appMetaGithub;
    },
  },
  Database: {
    apps: async (database: Database) => {
      const apps = await prisma.database
        .findUnique({
          where: {
            id: database.id,
          },
        })
        .apps();
      return apps;
    },
  },
};
