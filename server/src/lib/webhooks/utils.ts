import crypto from 'crypto';
import { Request } from 'express';

export const verifyWebhookSecret = (req: Request) => {
  // we get signature from gh
  const signature = req.header('X-Hub-Signature-256');
  // we encrypt signature from our db

  // we take repo id
  const repoId = req.body.repository.id.toString();

  // we take first 4 chars from gh client id
  const clientIDPart = process.env.GITHUB_CLIENT_ID.slice(0, 4);

  const webhooksSecret = repoId + clientIDPart;

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
