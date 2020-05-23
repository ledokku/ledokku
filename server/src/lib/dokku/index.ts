import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';
import { listVars } from './env/listVars';
import { add } from './env/add';

export const dokku = {
  apps: { create, logs },
  plugin: { installed, list },
  env: { listVars, add },
};
