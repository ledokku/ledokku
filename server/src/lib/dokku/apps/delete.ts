import NodeSsh from 'node-ssh';

// named deleteApp instead of delete because of the "strict" warning
// apparently you can't use word "delete" as var name
export const deleteApp = async (ssh: NodeSsh, appName: string) => {
  const resultAppsDelete = await ssh.execCommand(
    `--force apps:destroy ${appName}`
  );
  if (resultAppsDelete.code === 1) {
    console.error(resultAppsDelete);
    throw new Error(resultAppsDelete.stderr);
  }
};
