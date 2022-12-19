import { Roles } from '@prisma/client';
import { AuthChecker } from 'type-graphql';
import { DokkuContext } from '../data/models/dokku_context';
import prisma from '../lib/prisma';

export const authChecker: AuthChecker<DokkuContext, Roles> = async (
  { context },
  roles
): Promise<boolean> => {
  if (!context.auth) return false;

  const settings = await prisma.settings.findFirst();

  if (
    !settings.allowedEmails.includes(context.auth.user.email) &&
    context.auth.user.role !== Roles.OWNER
  ) {
    return false;
  }

  return roles.length === 0 || roles.includes(context.auth.user.role);
};
