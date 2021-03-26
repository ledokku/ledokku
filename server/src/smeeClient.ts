import SmeeClient from 'smee-client';
import { config } from './config';

/**
 * Proxy that redirects the events received from external sources to the local server.
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
