import { MutationResolvers } from '../../generated/graphql';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';
import { prisma } from '../../prisma';

export const addEnvVar: MutationResolvers['addEnvVar'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { appId, key, value } = input;

  const app = await prisma.app.findOne({
    where: {
      id: appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  const ssh = await sshConnect();

  const result = await dokku.config.set(ssh, app.name, key, value);

  return { result };
};
