import { MutationResolvers } from '../../generated/graphql';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';
import { appNameSchema } from '../utils';

export const addEnvVar: MutationResolvers['addEnvVar'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { name, key, value } = input;

  // We make sure the name is valid to avoid security risks
  appNameSchema.validateSync({ name });

  const ssh = await sshConnect();

  await dokku.env.add(ssh, name, key, value);

  const result = `Environment variable ${key}=${value} set successfully`;

  return { result };
};
