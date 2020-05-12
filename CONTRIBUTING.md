# Contributing to ledokku

## Requirements

- [Node](https://nodejs.org/en/) 12.0.0+
- [Yarn](https://classic.yarnpkg.com/en/) 1.2.0+
- [Docker](https://www.docker.com/) and docker compose installed.

## Pull Requests

For non-bug-fixes, please open an issue first and discuss your idea to make sure we're on the same page.

**Before submitting a pull request**, please make sure the following is done:

- Fork the repository and create a new branch from `master`.
- Must not break the test suite (`yarn test`). If you're fixing a bug, include a test that would fail without your fix.
- Must be formatted with prettier (`yarn prettier`).
- Must be **isolated**. Avoid grouping many, unrelated changes in a single PR.

## Development Workflow

To setup the project locally you first need to fork the project on Github (top right on the project page). Then clone the project: `git clone git@github.com:yourname/ledokku`. Now you can run `yarn` to install the dependencies.

### Setup dokku with vagrant

Follow the official guide to setup dokku with vagrant http://dokku.viewdocs.io/dokku/getting-started/install/vagrant/.

### Creating a new OAuth App

In your browser open https://github.com/settings/developers and click on the "New OAuth App" button.

Add a name, a homepage url, and in the field "Authorization callback URL" set the value to "http://localhost:3000/". Then click the "Register application" button. You should now be able to see the client id and client secret of the app.

### Setup environment variables

We use [dotenv](https://github.com/motdotla/dotenv) to loads environment variables from a `.env` file.

Let's first setup the client environment. Inside the `client` folder create a new `.env` file and add the following env variables (replace the `GITHUB_CLIENT_ID` value with the one you obtained when creating the Github OAuth App):

```
GITHUB_CLIENT_ID="MY_GITHUB_CLIENT_ID_CREATE_AT_THE_PREVIOUS_STEP"
SERVER_URL="http://localhost:4000"
```

Let's now setup the server environment. Inside the `server` folder create a new `.env` file and add the following env variables (replace the github id and secret with the one you obtained when creating the Github OAuth App, also replace the path to your local ssh key):

```
DATABASE_URL="postgres://postgres:postgrespassword@localhost:5433/postgres"
REDIS_URL="redis://127.0.0.1:6380"
GITHUB_CLIENT_ID="MY_GITHUB_CLIENT_ID_CREATE_AT_THE_PREVIOUS_STEP"
GITHUB_CLIENT_SECRET="MY_GITHUB_CLIENT_SECRET_CREATE_AT_THE_PREVIOUS_STEP"
JWT_SECRET="strong-secret"
DOKKU_SSH_HOST="dokku.me"
DOKKU_SSH_PORT="22"
SSH_PRIVATE_KEY_PATH="/home/myusername/.ssh/id_rsa"
```

Finally we also need to create a `.env` file for prisma. Inside the `server/prisma` folder create a new `.env` file and add the following env variable:

```
DATABASE_URL="postgres://postgres:postgrespassword@localhost:5433/postgres"
```

### Starting the databases

In your terminal, run `docker-compose up` from the root folder of the repository to start the database services required to run the app.

### Apply the latest migrations

To apply the latest migrations to the PostgreSQL database, in the `server` folder run `yarn prisma migrate up --experimental`.

### Starting the application

Inside the `server` folder run `yarn dev` to start the server. The server should now be listening incoming requests on port 4000.

Inside the `client` folder run `yarn dev` to start the next.js client app. The client should now be listening incoming requests on port 3000.

You can now open your browser and visit http://localhost:3000 to see the app running.

## Style Guide

To format the code automatically we use [prettier](https://prettier.io/). Run `yarn prettier` after making any changes to the code.

## License

Ledokku is licensed under the [MIT license](https://github.com/ledokku/ledokku/blob/master/LICENSE).
