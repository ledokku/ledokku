import { Request } from 'express';
import { prisma } from '../../prisma';
import { deployAppQueue } from './../../queues/deployApp';

export const githubPushWebhookHandler = async (req: Request) => {
  const appToRedeploy = await prisma.app.findFirst({
    where: {
      githubRepoId: req.body.repository.id.toString(),
    },
  });

  const branch = req.body.ref.replace('refs/heads/', '');
  const { git_url } = req.body.repository;

  if (appToRedeploy) {
    await deployAppQueue.add('deploy-app', {
      appName: appToRedeploy.name,
      gitRepoUrl: git_url,
      branchName: branch,
    });
  }
};
