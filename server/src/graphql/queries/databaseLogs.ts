import { dbTypeToDokkuPlugin } from '../utils';
import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';
import { prisma } from '../../prisma';

export const databaseLogs: QueryResolvers['databaseLogs'] = async (
  _,
  { databaseId },
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

  const logs = await dokku.database.logs(ssh, database.name, dbType);

  return { logs };
};
