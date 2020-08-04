import { dbTypeToDokkuPlugin } from '../utils';
import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';
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
  ]).catch((e) => {
    throw new Error(`failed to get data from db due to:${e}`);
  });

  const database = promiseResponse[0];
  const app = promiseResponse[1];

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  if (!database) {
    throw new Error(`Database with ID ${databaseId} not found`);
  }

  if (app.userId !== userId || database.userId !== userId) {
    throw new Error(`App with ID ${appId} does not belong to ${userId}`);
  }

  const dbType = dbTypeToDokkuPlugin(database.type);

  const ssh = await sshConnect();

  const isLinked = await dokku.database.linked(
    ssh,
    database.name,
    dbType,
    app.name
  );

  return { isLinked };
};
