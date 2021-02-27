import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { dokku } from './dokku';
import { sshConnect } from './ssh';

export const githubPushWebhookHandler = async (req: Request, res: Response) => {
  //TODO ADD WEBHOOK BODY VALIDATOR
  if (req.body) {
    res.status(200).end();
  }
  const ssh = await sshConnect();

  const appToRedeploy = await prisma.app.findMany({
    where: {
      //TODO MATCH WITH GIT REPO URL INSTEAD OF NAME
      name: req.body.repository.name,
    },
  });

  if (appToRedeploy) {
    await dokku.git.sync(
      ssh,
      req.body.repository.name,
      req.body.repository.git_url,
      // TODO GET BRANCH FROM BODY REF
      'main'
    );
  }
};
