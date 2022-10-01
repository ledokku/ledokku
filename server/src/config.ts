import * as yup from 'yup';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateKeyPairSync } from 'crypto';
import sshpk from 'sshpk';


/**
 * We generate a new ssh key if it's the first time server is booted
 */
const sshKeyFolderPath = join(process.env.HOME, '/.ssh');
export const sshKeyPath = join(sshKeyFolderPath, 'id_rsa');
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


export const formatGithubPem = (base64Pem?: string) => {
  if (!base64Pem) {
    return '';
  }

  const pem = Buffer.from(base64Pem, 'base64').toString('utf-8');

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
