import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';
import { prisma } from '../../prisma';

export const appLogs: QueryResolvers['appLogs'] = async (
  _,
  { appId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const app = await prisma.app.findUnique({
    where: {
      id: appId,
    },
  });

  if (!app) {
    throw new Error(`App with ID ${appId} not found`);
  }

  const ssh = await sshConnect();

  const logs = await dokku.apps.logs(ssh, app.name);

  ssh.dispose();

  return { logs };
};
