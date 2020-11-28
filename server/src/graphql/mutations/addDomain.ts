import { MutationResolvers } from '../../generated/graphql';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';
import { prisma } from '../../prisma';

export const addDomain: MutationResolvers['addDomain'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const app = await prisma.app.findOne({
    where: {
      id: input.appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${input.appId} not found`);
  }

  const { domainName } = input;

  const ssh = await sshConnect();

  await dokku.domains.add(ssh, app.name, domainName);

  return { result: true };
};
