import { Roles } from '@prisma/client';
import { AuthChecker } from 'type-graphql';
import { DokkuContext } from '../data/models/dokku_context';
import prisma from '../lib/prisma';

export const authChecker: AuthChecker<DokkuContext, Roles> = async (
  { context },
  roles
): Promise<boolean> => {
  if (!context.auth) return false;
  if (roles.length === 0) return true;

  const settings = await prisma.settings.findFirst();
  if (settings?.allowedEmails?.includes(context.auth.user.email) === false) return false;

  return roles.includes(context.auth.user.role);
};
