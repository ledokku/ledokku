---
id: upgrade
title: How to upgrade
---

To upgrade ledokku, all you have to do is to run the following command on your server:

```sh
docker pull ledokku/ledokku:0.3.1
docker tag ledokku/ledokku:0.3.1 dokku/ledokku:0.3.1
dokku tags:deploy ledokku 0.3.1
```

You can now enjoy the latest version of ledokku!
