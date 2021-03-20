import { prisma } from './../../prisma';
import crypto from 'crypto';
import { Request } from 'express';

export const verifyWebhookSecret = async (req: Request) => {
  // we get signature from gh
  const signature = req.header('X-Hub-Signature-256');

  if (!req.body) {
    throw new Error('Failed to fetch the request from github');
  }

  let appToRedeploy;

  // we look for all apps that are deployed from this repo
  const appMetaFromRepo = await prisma.appMetaGithub.findMany({
    where: {
      repoId: req.body.repository.id.toString(),
    },
  });

  // we look for the particular webhooks secret to be veriefied
  appMetaFromRepo.map((app) => {
    const webhooksSecret = app.webhooksSecret;

    const bodyCrypted =
      'sha256=' +
      crypto
        .createHmac('sha256', `${webhooksSecret}`)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (signature !== bodyCrypted) {
      appToRedeploy = null;
    } else {
      appToRedeploy = app;
    }
  });

  return appToRedeploy;
};
