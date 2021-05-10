import { repositories } from './repositories';
import { branches } from './branches';
import { githubInstallationId } from './githubInstallationId';
import { appMetaGithub } from './appGithubMeta';
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
import { appProxyPorts } from './appProxyPorts';
import { domains } from './domains';

export const queries = {
  app,
  appMetaGithub,
  apps,
  database,
  databases,
  databaseInfo,
  databaseLogs,
  domains,
  isDatabaseLinked,
  dokkuPlugins,
  appLogs,
  envVars,
  setup,
  isPluginInstalled,
  appProxyPorts,
  githubInstallationId,
  repositories,
  branches,
};
