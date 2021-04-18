import crypto from 'crypto';
import { Request } from 'express';
import { config } from '../../config';

export const verifyWebhookSecret = (req: Request) => {
  // we get signature from gh
  const signature = req.header('X-Hub-Signature-256');

  const bodyCrypted =
    'sha256=' +
    crypto

      .createHmac('sha256', config.githubAppWebhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

  if (signature !== bodyCrypted) {
    return false;
  }

  return true;
};
