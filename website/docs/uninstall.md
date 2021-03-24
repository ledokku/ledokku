---
id: uninstall
title: How to uninstall
---

If you want'to uninstall Ledokku there are multiple ways to do it:

### Uninstall Ledokku and keep dokku running

As Ledokku is a simple dokku app, to uninstall the app itself and
all of the associated data, you will need to just run these scripts on your server:

```sh
dokku apps:destroy ledokku
dokku postgres:destroy ledokku
dokku redis:destroy ledokku
```

### Uninstall both Ledokku and dokku

If you want to get rid of Ledokku and are fine with removing dokku from your server as well,
follow [this guide](https://dokku.com/docs/getting-started/uninstalling/).
