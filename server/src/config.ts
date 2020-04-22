import * as yup from 'yup';

const configSchema = yup.object({
  jwtSecret: yup
    .string()
    .required('Please provide a valid JWT_SECRET env variable.'),
  githubClientId: yup
    .string()
    .required('Please provide a valid GITHUB_CLIENT_ID env variable.'),
  githubClientSecret: yup
    .string()
    .required('Please provide a valid GITHUB_CLIENT_SECRET env variable.'),
  redisUrl: yup
    .string()
    .required('Please provide a valid REDIS_URL env variable.'),
});

type Config = yup.InferType<typeof configSchema>;

export const config: Config = {
  jwtSecret: process.env.JWT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  redisUrl: process.env.REDIS_URL,
};

try {
  configSchema.validateSync(config);
} catch (error) {
  const validationError: yup.ValidationError = error;
  console.error(`Environment validation failed. ${validationError.message}
Take a look at the contributing guide to see how to setup the project.
https://github.com/ledokku/ledokku/blob/master/CONTRIBUTING.md`);
  process.exit(1);
}
