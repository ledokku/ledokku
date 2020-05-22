import { appNameSchema } from './../utils';
import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';

// @ts-ignore
export const envVars: QueryResolvers['envVars'] = async (
  _,
  { name },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  appNameSchema.validateSync({ name });

  const ssh = await sshConnect();

  const envVars = await dokku.env.listVars(ssh, name);

  return { envVars };
};
