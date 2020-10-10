import { NodeSSH } from 'node-ssh';

export const list = async (ssh: NodeSSH) => {
  const resultAppsCreate = await ssh.execCommand(`apps:list`);
  if (resultAppsCreate.code === 1) {
    console.error(resultAppsCreate);
    throw new Error(resultAppsCreate.stderr);
  }

  const apps = resultAppsCreate.stdout.split('\n');
  // Remove the first line "=====> My Apps"
  apps.shift();
  return apps;
};
