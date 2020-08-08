import { dbTypeToDokkuPlugin } from './../utils';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';

export const unlinkDatabase: MutationResolvers['unlinkDatabase'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { databaseId, appId } = input;

  const [database, app] = await Promise.all([
    prisma.database.findOne({
      where: {
        id: databaseId,
      },
      include: {
        apps: {
          where: {
            id: appId,
          },
        },
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

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  if (!database) {
    throw new Error(`Database with ID ${databaseId} not found`);
  }

  if (app.userId !== userId || database.userId !== userId) {
    throw new Error(
      `App with ID ${appId} or database with ID ${databaseId} does not belong to ${userId}`
    );
  }

  const isLinked = database.apps.length === 1;

  if (!isLinked) {
    throw new Error(
      `${database.name} database is not linked to ${app.name} app`
    );
  }

  const dbType = dbTypeToDokkuPlugin(database.type);

  const ssh = await sshConnect();

  await dokku.database.unlink(ssh, database.name, dbType, app.name);

  await prisma.database.update({
    where: { id: database.id },
    data: {
      apps: {
        disconnect: { id: appId },
      },
    },
  });

  return { result: true };
};
