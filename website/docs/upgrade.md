---
id: upgrade
title: How to upgrade
---

To upgrade ledokku, all you have to do is to run the following command on your server:

```sh
dokku git:from-image ledokku ledokku/ledokku:0.7.0
```

Upgrading from **0.6.0** to **0.7.0**

```sh
dokku postgres:create ledokku-tmp
dokku postgres:link ledokku-tmp ledokku
dokku postgres:unlink ledokku ledokku
dokku postgres:destroy ledokku --force
dokku postgres:create ledokku
dokku postgres:link ledokku ledokku
dokku postgres:unlink ledokku-tmp ledokku
dokku postgres:destroy ledokku-tmp --force
```

You can now enjoy the latest version of ledokku!
