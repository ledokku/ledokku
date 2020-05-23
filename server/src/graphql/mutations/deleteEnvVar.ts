import { MutationResolvers } from '../../generated/graphql';
import { dokku } from '../../lib/dokku';
import { sshConnect } from '../../lib/ssh';
import { appNameSchema } from '../utils';

export const deleteEnvVar: MutationResolvers['deleteEnvVar'] = async (
  _,
  { input },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const { name, key } = input;

  // We make sure the name is valid to avoid security risks
  appNameSchema.validateSync({ name });

  const ssh = await sshConnect();

  await dokku.env.deleteEnvVar(ssh, name, key);

  const result = `Environment variable ${key} deleted successfully`;

  return { result };
};
