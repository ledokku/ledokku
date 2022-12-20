import { Roles } from '@prisma/client';
import { $log } from '@tsed/common';
import { AuthChecker } from 'type-graphql';
import { DokkuContext } from '../data/models/dokku_context';
import prisma from '../lib/prisma';

export const authChecker: AuthChecker<DokkuContext, Roles> = async (
  { context },
  roles
): Promise<boolean> => {
  $log.info(context.auth, roles);

  if (!context.auth) return false;

  const settings = await prisma.settings.findFirst();

  $log.info(
    settings,
    !settings.allowedEmails.includes(context.auth.user.email),
    context.auth.user.role !== Roles.OWNER,
    !settings.allowedEmails.includes(context.auth.user.email) &&
      context.auth.user.role !== Roles.OWNER
  );

  if (
    !settings.allowedEmails.includes(context.auth.user.email) &&
    context.auth.user.role !== Roles.OWNER
  ) {
    return false;
  }

  $log.info(roles.length === 0, roles.includes(context.auth.user.role));
  return roles.length === 0 || roles.includes(context.auth.user.role);
};
