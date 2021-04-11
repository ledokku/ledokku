import { readFileSync, writeFileSync } from 'fs';
import { Octokit } from '@octokit/rest';
import { MutationResolvers } from '../../generated/graphql';
import { config } from '../../config';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';

export const registerGithubApp: MutationResolvers['registerGithubApp'] = async (
  _,
  { code }
) => {
  // We allow only one app installation and it's not possible
  // to overwrite it for security reasons
  if (config.githubAppClientId) {
    throw new Error('Github Application already setup');
  }

  const octokit = new Octokit({});

  const githubResponse = await octokit.request(
    'POST /app-manifests/{code}/conversions',
    {
      code,
    }
  );

  const githubAppClientId = githubResponse.data.client_id;
  const githubAppClientSecret = githubResponse.data.client_secret;
  const githubAppWebhookSecret = githubResponse.data.webhook_secret;
  const githubAppPem = githubResponse.data.pem;
  const githubAppName = githubResponse.data.name;
  const githubAppId = githubResponse.data.id.toString();

  if (process.env.NODE_ENV === 'production') {
    // In production we add this config as dokku config for the ledokku app.
    // The no-restart option is used as we do not need to reboot the ledokku server.
    const ssh = await sshConnect();

    await dokku.config.set(
      ssh,
      'ledokku',
      [
        { key: 'GITHUB_APP_CLIENT_ID', value: githubAppClientId },
        { key: 'GITHUB_APP_CLIENT_SECRET', value: githubAppClientSecret },
        { key: 'GITHUB_APP_WEBHOOK_SECRET', value: githubAppWebhookSecret },
        { key: 'GITHUB_APP_PEM', value: githubAppPem },
        { key: 'GITHUB_APP_NAME', value: githubAppName },
        { key: 'GITHUB_APP_ID', value: githubAppId },
      ],
      { noRestart: true }
    );

    ssh.dispose();
  } else {
    // In dev mode we want to add these variables to the .env local file.
    const dotenvPath = `${process.cwd()}/.env`;
    let dotenvData = readFileSync(dotenvPath, {
      encoding: 'utf8',
    });
    dotenvData += `\n\n# Automatically added by ledokku server `;
    dotenvData += `\nGITHUB_APP_CLIENT_ID="${githubAppClientId}"`;
    dotenvData += `\nGITHUB_APP_NAME="${githubAppName}"`;
    dotenvData += `\nGITHUB_APP__ID="${githubAppId}"`;
    dotenvData += `\nGITHUB_APP_CLIENT_SECRET="${githubAppClientSecret}"`;
    dotenvData += `\nGITHUB_APP_WEBHOOK_SECRET="${githubAppWebhookSecret}"`;
    dotenvData += `\nGITHUB_APP_PEM="${githubAppPem}"\n`;
    writeFileSync(dotenvPath, dotenvData, { encoding: 'utf8' });
    console.log(`Github application config added to .env file.`);
  }

  // Add the config to the current runtime config so we don't have to restart the server
  config.githubAppClientId = githubAppClientId;
  config.githubAppClientSecret = githubAppClientSecret;
  config.githubAppWebhookSecret = githubAppWebhookSecret;
  config.githubAppPem = githubAppPem;
  config.githubAppName = githubAppName;
  config.githubAppId = githubAppId;

  return { githubAppClientId };
};
