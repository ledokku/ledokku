import * as yup from 'yup';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { generateKeyPairSync } from 'crypto';
import sshpk from 'sshpk';

const envSchema = yup.object({
  JWT_SECRET: yup
    .string()
    .required('Please provide a valid JWT_SECRET env variable.'),
  GITHUB_CLIENT_ID: yup
    .string()
    .required('Please provide a valid GITHUB_CLIENT_ID env variable.'),
  GITHUB_CLIENT_SECRET: yup
    .string()
    .required('Please provide a valid GITHUB_CLIENT_SECRET env variable.'),
  REDIS_URL: yup
    .string()
    .required('Please provide a valid REDIS_URL env variable.'),
  DOKKU_SSH_HOST: yup
    .string()
    .required('Please provide a valid DOKKU_SSH_HOST env variable.'),
  DOKKU_SSH_PORT: yup.string(),
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

const url = process.env.REDIS_URL.split(':');
const redisConnection = {
  host: url[1].replace('//', ''),
  port: +url[2],
};

export const config = {
  jwtSecret: process.env.JWT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  redisUrl: process.env.REDIS_URL,
  redisConnection,
  dokkuSshHost: process.env.DOKKU_SSH_HOST,
  dokkuSshPort: process.env.DOKKU_SSH_PORT ? +process.env.DOKKU_SSH_PORT : 22,
  privateKey,
  sshKeyPath,
};
