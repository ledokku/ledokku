import NodeSsh from 'node-ssh';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const createApp: MutationResolvers['createApp'] = async (
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

  // TODO create a pending app and create a queue to stream the logs

  const database = await prisma.app.create({
    data: {
      name: input.name,
      githubRepoUrl: input.gitUrl,
      githubId: 'TODO',
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
    `dokku clone ${input.name} https://github.com/heroku/node-js-getting-started.git`,
    {
      onStdout: (chunk) => {
        const message = chunk.toString('utf8');
        console.log('stdoutChunk', message);
      },
      onStderr: (chunk) => {
        const message = chunk.toString('utf8');
        console.log('onStderrChunk', message);
      },
    }
  );
  console.log('resultCommand', resultCommand);

  return database;
};
