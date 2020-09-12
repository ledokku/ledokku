import { NodeSSH } from 'node-ssh';

export const link = async (
  ssh: NodeSSH,
  databaseName: string,
  databaseType: string,
  appName: string
) => {
  const resultDatabaseLink = await ssh.execCommand(
    `${databaseType}:link ${databaseName} ${appName}`
  );
  if (resultDatabaseLink.code === 1) {
    console.error(resultDatabaseLink);
    throw new Error(resultDatabaseLink.stderr);
  }
};
