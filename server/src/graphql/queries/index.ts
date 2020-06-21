import { app } from './app';
import { apps } from './apps';
import { databases } from './databases';
import { dokkuPlugins } from './dokkuPlugins';
import { appLogs } from './appLogs';
import { envVars } from './envVars';
import { setup } from './setup';
import { isPluginInstalled } from './isPluginInstalled';

export const queries = {
  app,
  apps,
  databases,
  dokkuPlugins,
  appLogs,
  envVars,
  setup,
  isPluginInstalled,
};
