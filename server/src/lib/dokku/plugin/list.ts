import NodeSsh from 'node-ssh';

const parsePluginListCommand = (commandResult: string) => {
  const plugins = commandResult.split('\n');
  // First line is the plugin version
  const pluginVersion = plugins[0];
  // We remove the first line since it's not related to the installed plugins
  plugins.splice(0, 1);
  return {
    version: pluginVersion.split(' ')[1],
    plugins: plugins.map((plugin) => {
      const split = plugin.split(' ').filter((a) => a !== '');
      return {
        name: split[0],
        version: split[1],
      };
    }),
  };
};

export const list = async (ssh: NodeSsh) => {
  const resultPluginList = await ssh.execCommand('dokku plugin:list');
  if (resultPluginList.code !== 0) {
    console.error(resultPluginList);
    throw new Error(resultPluginList.stderr);
  }

  return parsePluginListCommand(resultPluginList.stdout);
};
