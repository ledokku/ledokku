import { NodeSSH } from 'node-ssh';

export const infoVersion = async (
  ssh: NodeSSH,
  databaseName: string,
  databaseType: string
) => {
  const resultDatabaseInfo = await ssh.execCommand(
    `${databaseType}:info ${databaseName} --version`
  );
  if (resultDatabaseInfo.code === 1) {
    console.error(resultDatabaseInfo);
    throw new Error(resultDatabaseInfo.stderr);
  }

  return resultDatabaseInfo.stdout;
};
