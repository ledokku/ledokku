# Installation

First we need to create the app.

```
dokku apps:create ledokku
```

Now pull the app from the Github registry and tag it.

```
docker pull docker.pkg.github.com/ledokku/ledokku/ledokku:0.0.1
docker tag ledokku/ledokku:0.0.1 dokku/ledokku:0.0.1
```

Finally we deploy the tag to start the app.

```
dokku tags:deploy ledokku 0.0.1
```
