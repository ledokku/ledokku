import { dbTypeToDokkuPlugin } from './../utils';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';

export const linkDatabase: MutationResolvers['linkDatabase'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { databaseId, appId } = input;

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

  if (app.userId !== userId) {
    throw new Error(`App with ID ${appId} does not belong to ${userId}`);
  }

  if (!database) {
    throw new Error(`Database with ID ${databaseId} not found`);
  }

  if (database.userId !== userId) {
    throw new Error(
      `Database with ID ${databaseId} does not belong to ${userId}`
    );
  }

  const dbLinks = linkedDbs.databases.find((db) => db.id === databaseId);

  const isLinked = !!dbLinks ? true : false;

  if (isLinked) {
    throw new Error(
      `Database with ID ${databaseId} is already linked to an app with id ${appId}`
    );
  }

  const dbType = dbTypeToDokkuPlugin(database.type);

  const ssh = await sshConnect();

  await dokku.database.link(ssh, database.name, dbType, app.name);

  await prisma.database.update({
    where: { id: database.id },
    data: {
      apps: {
        connect: { id: appId },
      },
    },
  });

  return { result: true };
};
