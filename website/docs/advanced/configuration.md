---
id: configuration
title: Configuration
---

You can customise the configuration of ledokku using the `dokku config:set` command.

Here is a list of the variables you can change:

- `JWT_SECRET`: Secret used to generate the JWT used for authentication.
- `GITHUB_APP_CLIENT_ID`: Github application client id used to authenticate a user via Github.
- `GITHUB_APP_CLIENT_SECRET`: Github application client secret used to authenticate a user via Github.
- `GITHUB_APP_WEBHOOK_SECRET`: Github application webhook secret used to verify webhook authenticity.
- `GITHUB_APP_PEM`: Github application private key.
- `DATABASE_URL`: Postgres connection string.
- `REDIS_URL`: Redis connection string.
- `DOKKU_SSH_HOST`: Ip address of the server.
- `DOKKU_SSH_PORT`: Port used to connect to the server via SSH.
- `NUMBER_USERS_ALLOWED`: Temporary solution to allow multiple users to login to your server. By default only one user is allowed to login to your server.
- `TELEMETRY_DISABLED`: ledokku collects completely anonymous telemetry data about general usage. You can opt-out by setting `NEXT_TELEMETRY_DISABLED` value to `1`.

For example if you want to change the `JWT_SECRET` configuration run: `dokku config:set ledokku JWT_SECRET my_new_value`
