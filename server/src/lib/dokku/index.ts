import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';
import { logs } from './apps/logs';
import { deleteApp } from './apps/delete';

export const dokku = {
  apps: { create, logs, deleteApp },
  plugin: { installed, list },
};
