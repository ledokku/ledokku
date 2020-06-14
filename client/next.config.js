const dotenv = require('dotenv');
const yup = require('yup');

dotenv.config();

const configSchema = yup.object({
  GITHUB_CLIENT_ID: yup
    .string()
    .required('Please provide a valid GITHUB_CLIENT_ID env variable.'),
  SERVER_URL: yup
    .string()
    .required('Please provide a valid SERVER_URL env variable.'),
});

const config = {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  SERVER_URL: process.env.SERVER_URL,
};

/**
 * We validate the schema only on development
 * Otherwise the docker prod build is failing
 */
if (process.env === 'development') {
  try {
    configSchema.validateSync(config);
  } catch (error) {
    const validationError = error;
    console.error(`Environment validation failed. ${validationError.message}
Take a look at the contributing guide to see how to setup the project.
https://github.com/ledokku/ledokku/blob/master/CONTRIBUTING.md`);
    process.exit(1);
  }
}

module.exports = {
  prerenderPages: false,
  env: config,
};
