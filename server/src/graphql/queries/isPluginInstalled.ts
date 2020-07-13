import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';

export const isPluginInstalled: QueryResolvers['isPluginInstalled'] = async (
  _,
  { pluginName },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const ssh = await sshConnect();

  const dokkuPlugins = await dokku.plugin.list(ssh);

  const isPluginInstalled =
    dokkuPlugins.plugins.filter((plugin) => plugin.name === pluginName)
      .length !== 0;

  return { isPluginInstalled };
};
