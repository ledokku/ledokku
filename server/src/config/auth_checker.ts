import { Roles } from '@prisma/client';
import { AuthChecker } from 'type-graphql';
import { DokkuContext } from '../data/models/dokku_context';

export const authChecker: AuthChecker<DokkuContext, Roles> = async (
  { context },
  roles
): Promise<boolean> => {
  if (!context.auth) return false;
  if (roles.length === 0) return true;

  return roles.includes(context.auth.user.role);
};
