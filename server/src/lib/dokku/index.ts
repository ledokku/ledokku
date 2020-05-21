import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';

export const dokku = {
  apps: { create, logs },
  plugin: { installed, list },
};
