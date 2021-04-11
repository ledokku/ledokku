import { deployAppQueue } from './../../queues/deployApp';
import { sshConnect } from './../../lib/ssh';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
// import { buildAppQueue } from '../../queues/buildApp';
import {
  githubAppCreationSchema,
  getRepoData,
  generateRandomToken,
} from '../utils';
import { dokku } from '../../lib/dokku';
import { config } from '../../config';

export const createAppGithub: MutationResolvers['createAppGithub'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // We make sure the name is valid to avoid security risks
  githubAppCreationSchema.validateSync({
    name: input.name,
    gitRepoUrl: input.gitRepoUrl,
  });

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

  const ssh = await sshConnect();

  const dokkuApp = await dokku.apps.create(ssh, input.name);

  const randomToken = generateRandomToken(20);

  const app = await prisma.app.create({
    data: {
      name: input.name,
      type: 'GITHUB',
      AppMetaGithub: {
        create: {
          repoName: repoData.repoName,
          repoOwner: repoData.owner,
          repoId: input.gitRepoId,
          githubAppInstallationId:
            process.env.NODE_ENV === 'production'
              ? config.githubAppInstallationId
              : process.env.GITHUB_APP_INSTALLATION_ID,
          webhooksSecret: randomToken,
          branch: input.branchName ? input.branchName : 'main',
        },
      },
    },
    include: {
      AppMetaGithub: true,
    },
  });

  if (dokkuApp) {
    await deployAppQueue.add('deploy-app', {
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
