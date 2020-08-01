import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { dokku } from '../../lib/dokku';
// import { buildAppQueue } from '../../queues/buildApp';
import { sshConnect } from '../../lib/ssh';
import { appNameSchema } from '../utils';

export const createApp: MutationResolvers['createApp'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // We make sure the name is valid to avoid security risks
  appNameSchema.validateSync({ name: input.name });

  // TODO check name of the app is unique per server

  const ssh = await sshConnect();

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
    },
  });

  // TODO enable again once we start the github app autodeployment
  // const appBuild = await prisma.appBuild.create({
  //   data: {
  //     status: 'PENDING',
  //     user: {
  //       connect: {
  //         id: userId,
  //       },
  //     },
  //     app: {
  //       connect: {
  //         id: app.id,
  //       },
  //     },
  //   },
  // });

  // // We trigger the queue that will add dokku to the server
  // await buildAppQueue.add('build-app', { buildId: appBuild.id });

  return { app };
};
