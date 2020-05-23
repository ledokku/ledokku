import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';
import { listVars } from './config/listVars';
import { set } from './config/set';
import { destroy } from './apps/delete';
import { unset } from './config/unset';

export const dokku = {
  apps: { create, logs, destroy },
  plugin: { installed, list },
  config: { listVars, set, unset },
};
