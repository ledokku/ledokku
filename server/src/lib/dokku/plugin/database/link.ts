import { NodeSSH, SSHExecOptions } from 'node-ssh';

export const link = async (
  ssh: NodeSSH,
  databaseName: string,
  databaseType: string,
  appName: string,
  options: SSHExecOptions
) => {
  const resultDatabaseLink = await ssh.execCommand(
    `${databaseType}:link ${databaseName} ${appName}`,
    options
  );

  return resultDatabaseLink;
};
