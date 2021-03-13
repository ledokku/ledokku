import { createDatabaseQueue } from './../../queues/createDatabase';
import { dbTypeToDokkuPlugin } from '../utils';
import * as yup from 'yup';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';

// Validate the name to make sure there are no security risks by adding it to the ssh exec command.
// Only lowercase letters and "-" allowed
// TODO unit test this schema
const createDatabaseSchema = yup.object({
  name: yup
    .string()
    .required()
    .matches(/^[a-z0-9-]+$/),
});

export const createDatabase: MutationResolvers['createDatabase'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // We make sure the name is valid to avoid security risks
  createDatabaseSchema.validateSync({ name: input.name });

  const databases = await prisma.database.findMany({
    where: {
      name: input.name,
      type: input.type,
    },
  });

  const isDbNameTaken = !!databases[0];

  if (isDbNameTaken) {
    throw new Error('Database name already taken');
  }

  const ssh = await sshConnect();

  const dokkuPlugins = await dokku.plugin.list(ssh);

  const isDbInstalled =
    dokkuPlugins.plugins.filter(
      (plugin) => plugin.name === dbTypeToDokkuPlugin(input.type)
    ).length !== 0;

  if (!isDbInstalled) {
    throw new Error(`Database ${input.type} is not installed`);
  }

  await createDatabaseQueue.add('create-database', {
    databaseName: input.name,
    databaseType: input.type,
    userId,
  });

  ssh.dispose();

  return { result: true };
};
