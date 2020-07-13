# Installation

> You need to run the following steps on a dokku server.
> If you do not have a dokku server for now, please follow the getting started guide.

First we need to create a new app for ledokku.

```sh
dokku apps:create ledokku
```

Create a new Redis database.

```sh
# If the Redis plugin is not installed on your server run the following command
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis

dokku redis:create ledokku
dokku redis:link ledokku ledokku
```

Create a new Postgres database.

```sh
# If the Postgres plugin is not installed on your server run, otherwise skip this command
sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres

dokku postgres:create ledokku
dokku postgres:link ledokku ledokku
```

In your browser open https://github.com/settings/developers and click on the "New OAuth App" button.

Add a name, a homepage url, and in the field "Authorization callback URL" set the value to your ledokku ip address and port 4000. (eg: http://123.123.123.123:4000)
Then click the "Register application" button. You should now be able to see the client id and client secret of the app. Let's add them to the ledokku config.

```sh
dokku config:set ledokku GITHUB_CLIENT_ID="MY_GITHUB_CLIENT_ID"
dokku config:set ledokku GITHUB_CLIENT_SECRET="MY_GITHUB_CLIENT_SECRET"
```

Now that github is configured let's add the missing env variables we need.

```sh
dokku config:set ledokku DOKKU_SSH_HOST="MY_SERVER_IP"
dokku config:set ledokku JWT_SECRET="SUPER_SECURE_SECRET"
```

Now pull the latest version of ledokku from the docker registry and tag it.

```sh
docker pull ledokku/ledokku:0.0.1
docker tag ledokku/ledokku:0.0.1 dokku/ledokku:0.0.1
```

Finally we deploy the tag to start our ledokku server.

```sh
dokku tags:deploy ledokku 0.0.1
```
