import crypto from 'crypto';
import { Request } from 'express';
import { GITHUB_APP_WEBHOOK_SECRET } from './../../constants';

export const verifyWebhookSecret = (req: Request) => {
  const signature = req.header('X-Hub-Signature-256');

  const bodyCrypted =
    'sha256=' +
    crypto

      .createHmac('sha256', GITHUB_APP_WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

  if (signature !== bodyCrypted) {
    return false;
  }

  return true;
};
