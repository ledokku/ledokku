import { create } from './apps/create';
import { installed } from './plugin/installed';
import { list } from './plugin/list';

export const dokku = {
  apps: { create },
  plugin: { installed, list },
};
