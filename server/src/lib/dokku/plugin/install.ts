import { NodeSSH } from 'node-ssh';

export const install = async (ssh: NodeSSH, pluginUrl: string) => {
  // TODO validate plugin url to allow only url finishing with .git
  const resultPluginInstall = await ssh.execCommand(
    `plugin:install ${pluginUrl}`
  );
  if (resultPluginInstall.code === 1) {
    console.error(resultPluginInstall);
    throw new Error(resultPluginInstall.stderr);
  }
};
