---
id: uninstall
title: How to uninstall Ledokku
---

# Remove Ledokku

As Ledokku is a simple dokku app, to uninstall the app itself and
delete all of the associated data, run these commands on your server:

```sh
dokku apps:destroy ledokku
dokku postgres:destroy ledokku
dokku redis:destroy ledokku
```

# Remove both Ledokku and dokku
After running the commands above,
follow *[this guide](https://dokku.com/docs/getting-started/uninstalling/)*.
