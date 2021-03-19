import { Request } from 'express';
import { prisma } from '../../prisma';
import { deployAppQueue } from './../../queues/deployApp';

export const githubPushWebhookHandler = async (req: Request) => {
  if (!req.body) {
    throw new Error('Failed to fetch the request from github');
  }

  const appGithubMeta = await prisma.appMetaGithub.findFirst({
    where: {
      repoId: req.body.repository.id.toString(),
    },
  });

  const app = await prisma.app.findFirst({
    where: {
      id: appGithubMeta.appId,
    },
  });

  if (appGithubMeta && app) {
    await deployAppQueue.add('deploy-app', {
      appId: app.id,
    });
  }
};
