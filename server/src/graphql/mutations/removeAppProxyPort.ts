import { MutationResolvers } from '../../generated/graphql';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';
import { prisma } from '../../prisma';

export const removeAppProxyPort: MutationResolvers['removeAppProxyPort'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const app = await prisma.app.findUnique({
    where: {
      id: input.appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${input.appId} not found`);
  }

  const ssh = await sshConnect();

  await dokku.proxy.portsRemove(
    ssh,
    app.name,
    input.scheme,
    input.host,
    input.container
  );

  ssh.dispose();

  return true;
};
