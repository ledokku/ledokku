import { Roles } from '@prisma/client';
import { AuthChecker } from 'type-graphql';
import { DokkuContext } from '../data/models/dokku_context';
import prisma from '../lib/prisma';
import { SettingsRepository } from '../repositories';

export const authChecker: AuthChecker<DokkuContext, Roles> = async (
  { context },
  roles
): Promise<boolean> => {
  if (!context.auth) return false;

  const settingsRepository = new SettingsRepository(prisma);
  const settings = await settingsRepository.get()
  if (
    !settings.allowedEmails.includes(context.auth.user.email) &&
    context.auth.user.role !== Roles.OWNER
  )
    return false;

  return roles.includes(context.auth.user.role) || roles.length === 0;
};
