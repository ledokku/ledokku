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
import { databasesLinkedToApp } from './databasesLinkedToApp';
import { appsLinkedToDatabase } from './appsLinkedToDatabase';

export const queries = {
  app,
  apps,
  appsLinkedToDatabase,
  database,
  databases,
  databaseInfo,
  databaseLogs,
  databasesLinkedToApp,
  isDatabaseLinked,
  dokkuPlugins,
  appLogs,
  envVars,
  setup,
  isPluginInstalled,
};
