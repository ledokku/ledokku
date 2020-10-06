import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';
import { listVars } from './config/listVars';
import { set } from './config/set';
import { destroy } from './apps/destroy';
import { unset } from './config/unset';
import { destroy as destroyDb } from './plugin/database/destroy';
import { info } from './plugin/database/info';
import { logs as databaseLogs } from './plugin/database/logs';

export const dokku = {
  apps: { create, logs, destroy },
  plugin: { installed, list },
  config: { listVars, set, unset },
  database: {
    destroy: destroyDb,
    info,
    logs: databaseLogs,
  },
};
