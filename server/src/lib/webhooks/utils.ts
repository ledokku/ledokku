import crypto from 'crypto';
import { Request } from 'express';

export const verifyWebhookSecret = (req: Request) => {
  // we get signature from gh
  const signature = req.header('X-Hub-Signature-256');
  // we encrypt signature from our db
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
