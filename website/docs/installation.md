# Installation

First we need to create a new app for ledokku.

```
dokku apps:create ledokku
```

Create a new Redis database.

```
dokku redis:create ledokku
dokku redis:link ledokku ledokku
```

Create a new Postgres database.

```
dokku postgres:create ledokku
dokku postgres:link ledokku ledokku
```

Now pull the app from the docker Github registry and tag it.

```
docker pull docker.pkg.github.com/ledokku/ledokku/ledokku:0.0.1
docker tag ledokku/ledokku:0.0.1 dokku/ledokku:0.0.1
```

Finally we deploy the tag to start the app.

```
dokku tags:deploy ledokku 0.0.1
```
