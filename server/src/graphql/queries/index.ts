import { app } from './app';
import { apps } from './apps';
import { databases } from './databases';
import { database } from './database';
import { dokkuPlugins } from './dokkuPlugins';
import { appLogs } from './appLogs';
import { envVars } from './envVars';
import { setup } from './setup';
import { isPluginInstalled } from './isPluginInstalled';
import { databaseInfo } from './databaseInfo';
import { databaseLogs } from './databaseLogs';
import { isDatabaseLinked } from './isDatabaseLinked';
export const queries = {
  app,
  apps,
  database,
  databases,
  databaseInfo,
  databaseLogs,
  isDatabaseLinked,
  dokkuPlugins,
  appLogs,
  envVars,
  setup,
  isPluginInstalled,
};
