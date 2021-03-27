import { readFileSync, writeFileSync } from 'fs';
import SmeeClient from 'smee-client';
import { config } from './config';

const startSmeeClient = async () => {
  /**
   * If webhookProxyUrl url is not set we automatically generate a new one
   * for the user and save it .env file.
   */
  if (!config.webhookProxyUrl) {
    const smeeUrl = await SmeeClient.createChannel();

    const dotenvPath = `${process.cwd()}/.env`;
    let dotenvData = readFileSync(dotenvPath, {
      encoding: 'utf8',
    });
    dotenvData += `\nWEBHOOK_PROXY_URL="${smeeUrl}"\n`;
    writeFileSync(dotenvPath, dotenvData, { encoding: 'utf8' });
    console.log(`WEBHOOK_PROXY_URL config added to .env file.`);

    config.webhookProxyUrl = smeeUrl;
  }

  /**
   * Start proxy that redirects the events received from external sources to the local server.
   */

  const smeeClient = new SmeeClient({
    source: config.webhookProxyUrl,
    target: 'http://localhost:4000/events',
    logger: console,
  });

  const events = smeeClient.start();

  process.on('exit', () => {
    events.close();
  });
};

startSmeeClient();
