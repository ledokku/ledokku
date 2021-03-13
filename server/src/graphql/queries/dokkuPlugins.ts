import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';

export const dokkuPlugins: QueryResolvers['dokkuPlugins'] = async (
  _,
  __,
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const ssh = await sshConnect();

  const dokkuPlugins = await dokku.plugin.list(ssh);

  ssh.dispose();

  return dokkuPlugins;
};
