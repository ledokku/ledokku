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

  // We find database to link
  const database = await prisma.database.findOne({
    where: {
      id: databaseId,
    },
  });

  // We find app to link
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

  if (isLinked) {
    throw new Error(
      `Database with ID ${databaseId} is already linked to an app with id ${appId}`
    );
  }

  const result = await dokku.database.link(
    ssh,
    database.name,
    dbType,
    app.name
  );

  await prisma.database.update({
    where: { id: database.id },
    data: {
      apps: {
        connect: { id: appId },
      },
    },
  });

  await prisma.app.update({
    where: { id: app.id },
    data: {
      databases: {
        connect: { id: databaseId },
      },
    },
  });

  // We link the database

  return { result };
};
