import * as yup from 'yup';
import NodeSsh from 'node-ssh';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

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

  const server = await prisma.server.findOne({
    where: { id: input.serverId },
    select: {
      id: true,
      ip: true,
      sshKey: { select: { id: true, privateKey: true } },
    },
  });
  if (!server) {
    throw new Error(`Server ${input.serverId} not found`);
  }
  // TODO implement other db support
  if (input.type !== 'POSTGRESQL') {
    throw new Error('Database not supported');
  }

  // We make sure the name is valid to avoid security risks
  createDatabaseSchema.validateSync({ name: input.name });

  const ssh = new NodeSsh();

  // First we setup a connection to the server
  await ssh.connect({
    host: server.ip,
    // TODO create separate user
    username: 'root',
    privateKey: server.sshKey.privateKey,
  });

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
      server: {
        connect: {
          id: input.serverId,
        },
      },
    },
  });

  return database;
};
