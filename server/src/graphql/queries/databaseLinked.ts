import { dbTypeToDokkuPlugin } from '../utils';
import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';
import { prisma } from '../../prisma';

export const databaseLinked: QueryResolvers['databaseLinked'] = async (
  _,
  { databaseId, appId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const database = await prisma.database.findOne({
    where: {
      id: databaseId,
    },
  });

  const app = await prisma.app.findOne({
    where: {
      id: appId,
    },
  });

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

  const dbType = dbTypeToDokkuPlugin(database.type);

  const ssh = await sshConnect();

  const isLinked = await dokku.database.linked(
    ssh,
    database.name,
    dbType,
    app.name
  );

  console.log('isLinkedf', isLinked);

  return { isLinked };
};
