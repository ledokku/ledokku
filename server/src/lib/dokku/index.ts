import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';
import { list as appList } from './apps/list';
import { listVars } from './config/listVars';
import { set } from './config/set';
import { destroy } from './apps/destroy';
import { unset } from './config/unset';
import { destroy as destroyDb } from './plugin/database/destroy';
import { info } from './plugin/database/info';
import { logs as databaseLogs } from './plugin/database/logs';
import { list as databaseList } from './plugin/database/list';
import { links as databaseLinks } from './plugin/database/links';
import { link } from './plugin/database/link';
import { unlink } from './plugin/database/unlink';
import { create as createDatabase } from './plugin/database/create';
import { proxyPorts } from './proxy/ports';

export const dokku = {
  apps: { create, logs, destroy, list: appList },
  plugin: { installed, list },
  config: { listVars, set, unset },
  database: {
    destroy: destroyDb,
    info,
    logs: databaseLogs,
    list: databaseList,
    listLinks: databaseLinks,
    create: createDatabase,
    link,
    unlink,
  },
  proxy: {
    ports: proxyPorts,
  },
};
