import NodeSsh from 'node-ssh';

export const destroy = async (ssh: NodeSsh, appName: string) => {
  const resultAppsDestroy = await ssh.execCommand(
    `--force apps:destroy ${appName}`
  );
  if (resultAppsDestroy.code === 1) {
    console.error(resultAppsDestroy);
    throw new Error(resultAppsDestroy.stderr);
  }

  return true;
};
