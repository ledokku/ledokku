import { readFileSync } from 'fs';
import createDebug from 'debug';
import { QueryResolvers } from '../../generated/graphql';
import { config } from '../../config';
import { sshConnect } from '../../lib/ssh';

const debug = createDebug(`queries:setup`);

export const setup: QueryResolvers['setup'] = async () => {
  const publicKey = readFileSync(`${config.sshKeyPath}.pub`, {
    encoding: 'utf8',
  });

  let canConnectSsh = false;
  try {
    await sshConnect();
    canConnectSsh = true;
  } catch (error) {
    // We do nothing as canConnectSsh is false
    debug(error);
  }

  return {
    canConnectSsh,
    sshPublicKey: publicKey,
    isGithubAppSetup: false,
    // See https://docs.github.com/en/developers/apps/creating-a-github-app-from-a-manifest#examples
    githubAppManifest: JSON.stringify({
      name: 'Ledokku',
      url: `http://${config.dokkuSshHost}`,
      hook_attributes: {
        url:
          process.env.NODE_ENV === 'production'
            ? `http://${config.dokkuSshHost}/github/events`
            : config.webhookProxyUrl,
      },
      redirect_url:
        process.env.NODE_ENV === 'production'
          ? `http://${config.dokkuSshHost}`
          : 'http://localhost:3000',
      public: false,
      default_permissions: {
        emails: 'read',
        contents: 'read',
        metadata: 'read',
      },
      default_events: ['push'],
    }),
  };
};
