import NodeSsh from 'node-ssh';

export const create = async (ssh: NodeSsh, appName: string) => {
  const resultAppsCreate = await ssh.execCommand(`apps:create ${appName}`);
  if (resultAppsCreate.code !== 0) {
    console.error(resultAppsCreate);
    throw new Error(resultAppsCreate.stderr);
  }
};
