import NodeSsh from 'node-ssh';

export const installed = async (
  ssh: NodeSsh,
  pluginName: string
): Promise<boolean> => {
  const resultPluginInstalled = await ssh.execCommand(
    `plugin:installed ${pluginName}`
  );
  return resultPluginInstalled.code === 0;
};
