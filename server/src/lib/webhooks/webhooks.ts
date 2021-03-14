import { Request } from 'express';
import { prisma } from '../../prisma';
import { deployAppQueue } from './../../queues/deployApp';

export const githubPushWebhookHandler = async (req: Request) => {
  const appToRedeploy = await prisma.app.findFirst({
    where: {
      githubRepoId: req.body.repository.id.toString(),
    },
  });

  const branch = appToRedeploy.githubBranch;
  const { clone_url } = req.body.repository;

  if (appToRedeploy) {
    await deployAppQueue.add('deploy-app', {
      appName: appToRedeploy.name,
      gitRepoUrl: clone_url,
      branchName: branch,
    });
  }
};
