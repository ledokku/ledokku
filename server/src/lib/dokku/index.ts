import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';
import { listVars } from './env/listVars';
import { add } from './env/add';
import { deleteApp } from './apps/delete';
import { deleteEnvVar } from './env/delete';

export const dokku = {
  apps: { create, logs, deleteApp },
  plugin: { installed, list },
  env: { listVars, add, deleteEnvVar },
};
