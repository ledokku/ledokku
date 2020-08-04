import NodeSsh from 'node-ssh';

export const linked = async (
  ssh: NodeSsh,
  databaseName: string,
  databaseType: string,
  appName: string
) => {
  const resultDatabaseLinked = await ssh.execCommand(
    `${databaseType}:linked ${databaseName} ${appName}`
  );

  if (resultDatabaseLinked.code === 1) {
    if (resultDatabaseLinked.stderr.includes('not linked')) {
      return false;
    } else {
      console.error(resultDatabaseLinked);
      throw new Error(resultDatabaseLinked.stderr);
    }
  }

  return true;
};
