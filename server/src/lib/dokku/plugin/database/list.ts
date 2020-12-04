import { NodeSSH } from 'node-ssh';

export const list = async (ssh: NodeSSH, databaseType: string) => {
  const resultAppsCreate = await ssh.execCommand(`${databaseType}:list`);
  if (resultAppsCreate.code === 1) {
    console.error(resultAppsCreate);
    throw new Error(resultAppsCreate.stderr);
  }

  const apps = resultAppsCreate.stdout.split('\n');
  // Remove the first line "=====> Postgres services"
  apps.shift();
  return apps;
};
