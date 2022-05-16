import * as yup from 'yup';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateKeyPairSync } from 'crypto';
import sshpk from 'sshpk';

const envSchema = yup.object({
  JWT_SECRET: yup
    .string()
    .required('Please provide a valid JWT_SECRET env variable.'),
  REDIS_URL: yup
    .string()
    .required('Please provide a valid REDIS_URL env variable.'),
  DOKKU_SSH_HOST: yup
    .string()
    .required('Please provide a valid DOKKU_SSH_HOST env variable.'),
  DOKKU_WEB_HOST: yup
    .string()
    .required('Please provide a valid DOKKU_WEB_HOST env variable.'),
  DOKKU_SSH_PORT: yup.string(),
  /**
   * Temporary solution until we have proper user management.
   */
  NUMBER_USERS_ALLOWED: yup.string(),
});

try {
  envSchema.validateSync(process.env);
} catch (error) {
  const validationError: yup.ValidationError = error;
  console.error(`Environment validation failed. ${validationError.message}
Take a look at the contributing guide to see how to setup the project.
https://github.com/ledokku/ledokku/blob/master/CONTRIBUTING.md`);
  process.exit(1);
}

/**
 * We generate a new ssh key if it's the first time server is booted
 */
const sshKeyFolderPath = join(process.env.HOME, '/.ssh');
const sshKeyPath = join(sshKeyFolderPath, 'id_rsa');
if (!existsSync(sshKeyPath)) {
  //   create public and private ssh key
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  // parse ssh
  const pemKey = sshpk.parseKey(publicKey, 'pem');
  const sshKeyPublicKey = pemKey.toString('ssh');
  const sshKeyPrivateKey = sshpk
    .parsePrivateKey(privateKey, 'pem')
    .toString('ssh');

  mkdirSync(sshKeyFolderPath, { recursive: true });
  writeFileSync(sshKeyPath, sshKeyPrivateKey, {
    encoding: 'utf8',
    mode: '400',
  });
  writeFileSync(`${sshKeyPath}.pub`, sshKeyPublicKey, {
    encoding: 'utf8',
    mode: '400',
  });

  console.log(`
    Successfully generated a new private key 🎉.
    To setup the ssh access, run the following command on your dokku server.
    echo "${sshKeyPublicKey}" | dokku ssh-keys:add ledokku
  `);
}

const privateKey = readFileSync(sshKeyPath, {
  encoding: 'utf8',
});

// helper function to parse github PEM
export const formatGithubPem = (pem: string) => {
  if (!pem) {
    return '';
  }

  const githubAppPemSplit = pem.split('\n');
  const joinedPem = githubAppPemSplit.join('');
  const formattedStart = joinedPem.replace(
    '-----BEGIN RSA PRIVATE KEY-----',
    '-----BEGIN RSA PRIVATE KEY-----\n'
  );
  const formattedPem = formattedStart.replace(
    '-----END RSA PRIVATE KEY-----',
    '\n-----END RSA PRIVATE KEY-----'
  );

  return formattedPem;
};

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  githubAppClientId: process.env.GITHUB_APP_CLIENT_ID,
  githubAppClientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  githubAppWebhookSecret: process.env.GITHUB_APP_WEBHOOK_SECRET,
  githubAppName: process.env.GITHUB_APP_NAME,
  githubAppId: process.env.GITHUB_APP_ID,
  githubAppPem: formatGithubPem(process.env.GITHUB_APP_PEM),
  redisUrl: process.env.REDIS_URL,
  dokkuSshHost: process.env.DOKKU_SSH_HOST,
  dokkuWebHost: process.env.DOKKU_WEB_HOST,
  dokkuSshPort: process.env.DOKKU_SSH_PORT ? +process.env.DOKKU_SSH_PORT : 22,
  privateKey,
  sshKeyPath,
  numberUsersAllowed: process.env.NUMBER_USERS_ALLOWED
    ? +process.env.NUMBER_USERS_ALLOWED
    : 1,
  telemetryDisabled:
    process.env.NODE_ENV === 'production'
      ? process.env.TELEMETRY_DISABLED
      : // Always disabled in dev mode
        '1',
  webhookProxyUrl: process.env.WEBHOOK_PROXY_URL,
};
