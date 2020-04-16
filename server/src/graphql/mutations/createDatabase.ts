import NodeSsh from 'node-ssh';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

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

  // TODO need to validate the name to make sure there are no security risks by adding it to the ssh exec command
  // TODO only letters and "-" allowed

  // TODO run ssh command
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
  console.log('resultCommand', resultCommand);

  const database = await prisma.database.create({
    data: {
      name: input.name,
      // TODO allow user to select the type
      type: 'POSTGRESQL',
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
