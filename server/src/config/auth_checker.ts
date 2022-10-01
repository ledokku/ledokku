import { AuthChecker } from 'type-graphql';
import { DokkuContext } from '../data/models/dokku_context';

export const authChecker: AuthChecker<DokkuContext> = async ({
  context,
}): Promise<boolean> => {
  return !!context.auth;
};
