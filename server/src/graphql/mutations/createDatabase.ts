import * as yup from 'yup';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';

// Validate the name to make sure there are no security risks by adding it to the ssh exec command.
// Only letters and "-" allowed
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

  // TODO implement other db support
  if (input.type !== 'POSTGRESQL') {
    throw new Error('Database not supported');
  }

  // We make sure the name is valid to avoid security risks
  createDatabaseSchema.validateSync({ name: input.name });

  const ssh = await sshConnect();

  const isDbInstalled = await dokku.plugin.installed(ssh, 'postgres');
  if (!isDbInstalled) {
    throw new Error('Database postgres is not installed');
  }

  const resultCommand = await ssh.execCommand(
    `dokku postgres:create ${input.name}`
  );

  if (resultCommand.code !== 0) {
    console.error(resultCommand);
    throw new Error(resultCommand.stderr);
  }

  const database = await prisma.database.create({
    data: {
      name: input.name,
      type: input.type,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return database;
};
