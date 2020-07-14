import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';
import { listVars } from './config/listVars';
import { set } from './config/set';
import { destroy } from './apps/destroy';
import { unset } from './config/unset';
import { create as createPostgres } from './plugin/postgres/create';
import { destroy as destroyPostgres } from './plugin/postgres/destroy';

export const dokku = {
  apps: { create, logs, destroy },
  plugin: { installed, list },
  config: { listVars, set, unset },
  postgres: { createPostgres, destroyPostgres },
};
