import crypto from 'crypto';
import { Request } from 'express';
import { GITHUB_APP_WEBHOOK_SECRET } from './../../constants';

export const verifyWebhookSecret = (signature: string, rawBody: Buffer) => {
  const bodyCrypted =
    'sha256=' +
    crypto

      .createHmac('sha256', GITHUB_APP_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

  if (signature !== bodyCrypted) {
    return false;
  }

  return true;
};
