import NodeSsh from 'node-ssh';

export const install = async (ssh: NodeSsh, pluginUrl: string) => {
  // TODO validate plugin url to allow only url finishing with .git
  const resultPluginInstall = await ssh.execCommand(
    `dokku plugin:install ${pluginUrl}`
  );
  if (resultPluginInstall.code !== 0) {
    console.error(resultPluginInstall);
    throw new Error(resultPluginInstall.stderr);
  }

  return resultPluginInstall.code === 0;
};
