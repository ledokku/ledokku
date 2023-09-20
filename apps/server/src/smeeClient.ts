import { $log } from '@tsed/common';
import { readFileSync, writeFileSync } from 'fs';
import SmeeClient from 'smee-client-patched';
import { changeWebhookProxyUrl, WEBHOOK_PROXY_URL } from './constants';

export const startSmeeClient = async () => {
  if (!WEBHOOK_PROXY_URL) {
    const smeeUrl = await SmeeClient.createChannel();

    const dotenvPath = `${process.cwd()}/.env`;
    let dotenvData = readFileSync(dotenvPath, {
      encoding: 'utf8',
    });
    dotenvData += `\nWEBHOOK_PROXY_URL="${smeeUrl}"\n`;
    writeFileSync(dotenvPath, dotenvData, { encoding: 'utf8' });
    $log.info(`WEBHOOK_PROXY_URL config added to .env file.`);

    changeWebhookProxyUrl(smeeUrl);
  }

  const smeeClient = new SmeeClient({
    source: WEBHOOK_PROXY_URL,
    target: 'http://localhost:4000/api/webhooks',
    logger: $log,
  });

  const events = smeeClient.start();

  process.on('exit', () => {
    events.close();
  });
};
