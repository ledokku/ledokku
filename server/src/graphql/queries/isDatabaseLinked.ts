import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const isDatabaseLinked: QueryResolvers['isDatabaseLinked'] = async (
  _,
  { databaseId, appId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const promiseResponse = await Promise.all([
    prisma.database.findOne({
      where: {
        id: databaseId,
      },
    }),
    prisma.app.findOne({
      where: {
        id: appId,
      },
    }),
    prisma.app.findOne({
      where: {
        id: appId,
      },
      select: {
        databases: true,
      },
    }),
  ]).catch((e) => {
    throw new Error(`failed to get data from db due to:${e}`);
  });

  const database = promiseResponse[0];
  const app = promiseResponse[1];
  const linkedDbs = promiseResponse[2];

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  if (!database) {
    throw new Error(`Database with ID ${databaseId} not found`);
  }

  if (app.userId !== userId || database.userId !== userId) {
    throw new Error(
      `App with ID ${appId} or databsde with ${databaseId} does not belong to ${userId}`
    );
  }

  const dbLinks = linkedDbs.databases.find((db) => db.id === databaseId);

  const isLinked = !!dbLinks ? true : false;

  return { isLinked };
};
