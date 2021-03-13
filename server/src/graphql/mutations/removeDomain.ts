import { MutationResolvers } from '../../generated/graphql';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';
import { prisma } from '../../prisma';

export const removeDomain: MutationResolvers['removeDomain'] = async (
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

  const { domainName } = input;

  const ssh = await sshConnect();

  await dokku.domains.remove(ssh, app.name, domainName);

  ssh.dispose();

  return { result: true };
};
