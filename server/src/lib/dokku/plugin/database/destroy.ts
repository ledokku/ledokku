import NodeSsh from 'node-ssh';

export const destroy = async (
  ssh: NodeSsh,
  databaseName: string,
  databaseType: string
) => {
  const resultDatabaseDestroy = await ssh.execCommand(
    `--force ${databaseType}:destroy ${databaseName}`
  );
  if (resultDatabaseDestroy.code === 1) {
    console.error(resultDatabaseDestroy);
    throw new Error(resultDatabaseDestroy.stderr);
  }

  return true;
};
