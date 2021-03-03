# Contributing to ledokku

## Requirements

- [Node](https://nodejs.org/en/) 12.0.0+
- [Docker](https://www.docker.com/) and docker compose installed.

## Pull Requests

For non-bug-fixes, please open an issue first and discuss your idea to make sure we're on the same page.

**Before submitting a pull request**, please make sure the following is done:

- Fork the repository and create a new branch from `master`.
- Must not break the test suite (`npm test`). If you're fixing a bug, include a test that would fail without your fix.
- Must be formatted with prettier (`npm run prettier`).
- Must be **isolated**. Avoid grouping many, unrelated changes in a single PR.

## Development Workflow

To setup the project locally you first need to fork the project on Github (top right on the project page). Then clone the project: `git clone git@github.com:yourname/ledokku`. Now you can run `npm ci` to install the dependencies.

### Setup dokku with vagrant

Follow the official guide to setup dokku with vagrant http://dokku.viewdocs.io/dokku/getting-started/install/vagrant/.

### Creating a new OAuth App

In your browser open https://github.com/settings/developers and click on the "New OAuth App" button.

Add a name, a homepage url, and in the field "Authorization callback URL" set the value to "http://localhost:3000/". Then click the "Register application" button. You should now be able to see the client id and client secret of the app.

### Setup environment variables

We use [dotenv](https://github.com/motdotla/dotenv) to loads environment variables from a `.env` file.

Let's first setup the client environment. Inside the `client` folder create a new `.env.development.local` file and add the following env variables:

```
REACT_APP_GITHUB_CLIENT_ID="MY_GITHUB_CLIENT_ID_CREATED_AT_THE_PREVIOUS_STEP"
```

Let's now setup the server environment. Inside the `server` folder create a new `.env` file and add the following env variables (replace the github id and secret with the one you obtained when creating the Github OAuth App):

```
GITHUB_CLIENT_ID="MY_GITHUB_CLIENT_ID_CREATE_AT_THE_PREVIOUS_STEP"
GITHUB_CLIENT_SECRET="MY_GITHUB_CLIENT_SECRET_CREATE_AT_THE_PREVIOUS_STEP"
JWT_SECRET="strong-secret"
DOKKU_SSH_HOST="dokku.me"
DOKKU_SSH_PORT="22"
```

### Starting the services

In your terminal, run `docker-compose up` from the root folder of the repository to start the database and apps services. When the server is booting, the prisma client is generated and the latest migration is executed on the database. The web application is running on port 3000 and the server on port 4000.

If you take a look at the server logs in the terminal, you should see a message saying that the server successfully generated a new ssh key. You need to add this key to the dokku vagrant instance to allow the server to interact with it. In order to connect to the vagrant box run `vagrant ssh`. Then copy paste the command the server printed in the logs. Once the key is added your server should be able to connect to the dokku instance.

You can now open your browser and visit http://localhost:3000 to see the app running.

### Create a new migration

To create a new database migration, first edit the `schema.prisma` file with the changes you would like to do. Then connect to the server docker container `docker-compose run server bash`. To apply the latest migration to the PostgreSQL database `npm run prisma:migrate dev --preview-feature`. Finally to regenerate the prisma client with your latest changes run `npm run prisma:generate`.

#### Removing migration you created

In case you have created a new database migration and want to remove it, don't remove the files as it will cause data mismatch. Instead run `npm run prisma:migrate down`.

## Style Guide

To format the code automatically we use [prettier](https://prettier.io/). Run `npm run prettier` after making any changes to the code.

## License

Ledokku is licensed under the [MIT license](https://github.com/ledokku/ledokku/blob/master/LICENSE).
