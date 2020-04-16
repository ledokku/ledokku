const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  prerenderPages: false,
  env: {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    SERVER_URL: process.env.SERVER_URL,
  },
};
