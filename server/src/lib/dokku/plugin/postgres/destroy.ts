import NodeSsh from 'node-ssh';

export const destroy = async (ssh: NodeSsh, databaseName: string) => {
  const resultPostgresDestroy = await ssh.execCommand(
    `--force postgres:destroy ${databaseName}`
  );
  if (resultPostgresDestroy.code === 1) {
    console.error(resultPostgresDestroy);
    throw new Error(resultPostgresDestroy.stderr);
  }

  return true;
};
