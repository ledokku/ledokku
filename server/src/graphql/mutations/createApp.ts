import { deployAppQueue } from './../../queues/deployApp';
import { sshConnect } from './../../lib/ssh';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import fetch from 'node-fetch';
// import { buildAppQueue } from '../../queues/buildApp';
import { appNameSchema, getRepoData } from '../utils';
import { dokku } from '../../lib/dokku';

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

  const repoData = getRepoData(input.gitRepoUrl);

  let repo;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repoData.owner}/${repoData.repoName}`
    );
    repo = await res.json();
  } catch (error) {
    console.log(error);
  }

  const ssh = await sshConnect();

  const dokkuApp = await dokku.apps.create(ssh, input.name);

  const app = await prisma.app.create({
    data: {
      name: input.name,
      githubRepoId: repo ? repo.id.toString() : undefined,
    },
  });

  if (input.gitRepoUrl && dokkuApp) {
    await deployAppQueue.add('deploy-app', {
      appName: input.name,
      gitRepoUrl: input.gitRepoUrl,
      branchName: input.branchName,
      dokkuApp,
      appId: app.id,
    });
  }

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
