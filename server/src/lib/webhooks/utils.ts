import crypto from 'crypto';
import { Request } from 'express';

export const verifyWebhookSecret = (req: Request) => {
  const signature = req.header('X-Hub-Signature-256');
  const bodyCrypted =
    'sha256=' +
    crypto
      // TODO ADD ENV VAR HERE INSTEAD OF DOKKU
      .createHmac('sha256', 'dokku')
      .update(JSON.stringify(req.body))
      .digest('hex');

  if (signature !== bodyCrypted) {
    return false;
  } else {
    return true;
  }
};
