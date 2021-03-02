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

  const database = await prisma.database.findUnique({
    where: {
      id: databaseId,
    },
  });

  if (!database) {
    throw new Error(`Database with ID ${databaseId} not found`);
  }

  const dbType = dbTypeToDokkuPlugin(database.type);

  const ssh = await sshConnect();

  const logs = await dokku.database.logs(ssh, database.name, dbType);

  return { logs };
};
