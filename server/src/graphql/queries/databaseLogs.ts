import { dbTypeToDokkuPlugin } from './../utils';
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
    throw new Error(`App with ID ${databaseId} not found`);
  }

  console.log(database.type);
  const dbType = dbTypeToDokkuPlugin(database.type);
  console.log(dbType);

  const ssh = await sshConnect();

  const logs = await dokku.postgres.info(ssh, database.name, dbType);

  return { logs };
};
