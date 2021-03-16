import { prisma } from './../../prisma';
import crypto from 'crypto';
import { Request } from 'express';

export const verifyWebhookSecret = async (req: Request) => {
  // we get signature from gh
  const signature = req.header('X-Hub-Signature-256');

  const appToRedeploy = await prisma.appMetaGithub.findFirst({
    where: {
      repoId: req.body.repository.id.toString(),
    },
  });

  const webhooksSecret = appToRedeploy.webhooksSecret;

  const bodyCrypted =
    'sha256=' +
    crypto
      .createHmac('sha256', `${webhooksSecret}`)
      .update(JSON.stringify(req.body))
      .digest('hex');

  if (signature !== bodyCrypted) {
    return false;
  } else {
    return true;
  }
};
