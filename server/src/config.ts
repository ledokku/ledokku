import * as yup from 'yup';
import { readFileSync } from 'fs';

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
  DOKKU_SSH_PORT: yup
    .string()
    .required('Please provide a valid DOKKU_SSH_PORT env variable.'),
  SSH_PRIVATE_KEY_PATH: yup
    .string()
    .required('Please provide a valid SSH_PRIVATE_KEY_PATH env variable.'),
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

const privateKey = readFileSync(process.env.SSH_PRIVATE_KEY_PATH, {
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
  dokkuSshPort: +process.env.DOKKU_SSH_PORT,
  privateKey,
};
