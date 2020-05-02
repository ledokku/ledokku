import NodeSsh from 'node-ssh';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
import { buildAppQueue } from '../../queues/buildApp';

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
  // TODO check name of the app is unique per server

  const ssh = new NodeSsh();

  // First we setup a connection to the server
  await ssh.connect({
    host: server.ip,
    // TODO create separate user
    username: 'root',
    privateKey: server.sshKey.privateKey,
  });

  await dokku.apps.create(ssh, input.name);

  const app = await prisma.app.create({
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

  const appBuild = await prisma.appBuild.create({
    data: {
      status: 'PENDING',
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
      app: {
        connect: {
          id: app.id,
        },
      },
    },
  });

  // We trigger the queue that will add dokku to the server
  await buildAppQueue.add('build-app', { buildId: appBuild.id });

  return app;
};
