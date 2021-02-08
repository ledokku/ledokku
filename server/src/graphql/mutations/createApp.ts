import { createAppQueue } from './../../queues/createApp';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
// import { buildAppQueue } from '../../queues/buildApp';
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

  const apps = await prisma.app.findMany({
    where: {
      name: input.name,
    },
  });

  const isAppNameTaken = !!apps[0];

  if (isAppNameTaken) {
    throw new Error('App name already taken');
  }

  await createAppQueue.add('create-app', {
    appName: input.name,
    userId,
    gitRepoUrl: input.gitRepoUrl,
    branchName: input.branchName,
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

  return { result: true };
};
