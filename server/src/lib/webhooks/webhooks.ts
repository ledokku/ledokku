import { Request } from 'express';
import { prisma } from '../../prisma';
import { deployAppQueue } from './../../queues/deployApp';

export const githubPushWebhookHandler = async (req: Request) => {
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

  const branch = appGithubMeta.branch;
  const { clone_url } = req.body.repository;

  if (appGithubMeta && app) {
    await deployAppQueue.add('deploy-app', {
      appName: app.name,
      gitRepoUrl: clone_url,
      branchName: branch,
    });
  }
};
