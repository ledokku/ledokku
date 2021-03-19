import { deployAppQueue } from './../../queues/deployApp';
import { sshConnect } from './../../lib/ssh';
import { MutationResolvers } from '../../generated/graphql';
import { Octokit } from '@octokit/rest';
import { prisma } from '../../prisma';
import crypto from 'crypto';
// import { buildAppQueue } from '../../queues/buildApp';
import { appNameSchema, getRepoData } from '../utils';
import { dokku } from '../../lib/dokku';

export const createAppGithub: MutationResolvers['createAppGithub'] = async (
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

  const octokit = new Octokit({});

  let repo;

  const repoData = getRepoData(input.gitRepoUrl);
  try {
    repo = await octokit.repos.get({
      owner: repoData.owner,
      repo: repoData.repoName,
    });
  } catch (error) {
    console.log(error);
  }

  const ssh = await sshConnect();

  const dokkuApp = await dokku.apps.create(ssh, input.name);

  const hash = crypto
    .createHash('sha256')
    .update(`${input.name}` + `${userId}`, 'utf8')
    .digest('hex')
    .slice(0, 40);

  const app = await prisma.app.create({
    data: {
      name: input.name,
      type: 'GITHUB',
      AppMetaGithub: {
        create: {
          repoUrl: input.gitRepoUrl,
          repoId: repo.data.id.toString(),
          webhooksSecret: hash,
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
