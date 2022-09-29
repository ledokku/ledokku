import { branches } from './branches';
import { databaseInfo } from './databaseInfo';
import { databaseLogs } from './databaseLogs';
import { dokkuPlugins } from './dokkuPlugins';
import { domains } from './domains';
import { envVars } from './envVars';
import { githubInstallationId } from './githubInstallationId';
import { isDatabaseLinked } from './isDatabaseLinked';
import { isPluginInstalled } from './isPluginInstalled';
import { repositories } from './repositories';

export const queries = {
  databaseInfo,
  databaseLogs,
  domains,
  isDatabaseLinked,
  dokkuPlugins,
  envVars,
  isPluginInstalled,
  githubInstallationId,
  repositories,
  branches,
};
