import { Request } from 'express';
import { prisma } from '../../prisma';
import { dokku } from '../dokku';

import { sshConnect } from '../ssh';

export const githubPushWebhookHandler = async (req: Request) => {
  const ssh = await sshConnect();

  const appToRedeploy = await prisma.app.findMany({
    where: {
      githubRepoId: req.body.repository.id.toString(),
    },
  });

  const branch = req.body.ref.replace('refs/heads/', '');
  const { name, git_url } = req.body.repository;

  if (appToRedeploy) {
    await dokku.git.sync(ssh, name, git_url, branch);
  }
};
