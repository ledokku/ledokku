import { prisma } from '../prisma';
import { App, Database } from '../generated/graphql';

export const customResolvers = {
  App: {
    databases: async (app: App) => {
      const databases = await prisma.app
        .findOne({
          where: {
            id: app.id,
          },
        })
        .databases();

      return databases;
    },
  },
  Database: {
    apps: async (database: Database) => {
      const apps = await prisma.database
        .findOne({
          where: {
            id: database.id,
          },
        })
        .apps();
      return apps;
    },
  },
};
