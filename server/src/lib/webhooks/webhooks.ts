import { prisma } from '../../prisma';
import { deployAppQueue } from './../../queues/deployApp';

export const githubPushWebhookHandler = async (appToRedeployMeta: any) => {
  const appGithubMeta = await prisma.appMetaGithub.findFirst({
    where: {
      appId: appToRedeployMeta.appId,
    },
  });

  const app = await prisma.app.findFirst({
    where: {
      id: appGithubMeta.appId,
    },
  });

  // TODO MAKE WEBHOOKS WORK

  // if (appGithubMeta && app) {
  //   await deployAppQueue.add('deploy-app', {
  //     appId: app.id,
  //   });
  // }
};
