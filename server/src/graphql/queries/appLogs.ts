import { appNameSchema } from './../utils';
import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';

export const appLogs: QueryResolvers['appLogs'] = async (
  _,
  { name },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  appNameSchema.validateSync({ name });

  const ssh = await sshConnect();

  const logs = await dokku.apps.logs(ssh, name);

  return { logs };
};
