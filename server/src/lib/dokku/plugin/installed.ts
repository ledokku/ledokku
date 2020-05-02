import NodeSsh from 'node-ssh';

export const installed = async (
  ssh: NodeSsh,
  pluginName: string
): Promise<boolean> => {
  // TODO validate plugin name to allow only safe chars
  const resultPluginInstalled = await ssh.execCommand(
    `dokku plugin:installed ${pluginName}`
  );
  return resultPluginInstalled.code === 0;
};
