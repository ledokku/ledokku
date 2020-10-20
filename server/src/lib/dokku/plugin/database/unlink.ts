import { NodeSSH, SSHExecOptions } from 'node-ssh';

export const unlink = async (
  ssh: NodeSSH,
  databaseName: string,
  databaseType: string,
  appName: string,
  options: SSHExecOptions
) => {
  const resultDatabaseUnLink = await ssh.execCommand(
    `${databaseType}:unlink ${databaseName} ${appName}`,
    options
  );

  return resultDatabaseUnLink;
};
