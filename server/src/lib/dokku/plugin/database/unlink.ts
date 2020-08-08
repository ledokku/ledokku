import NodeSsh from 'node-ssh';

export const unlink = async (
  ssh: NodeSsh,
  databaseName: string,
  databaseType: string,
  appName: string
) => {
  const resultDatabaseUnLink = await ssh.execCommand(
    `${databaseType}:unlink ${databaseName} ${appName}`
  );
  if (resultDatabaseUnLink.code === 1) {
    console.error(resultDatabaseUnLink);
    throw new Error(resultDatabaseUnLink.stderr);
  }
};
