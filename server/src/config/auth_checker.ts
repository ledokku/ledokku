import { AuthChecker } from 'type-graphql';
import { DokkuContext } from '../data/models/dokku_context';

export const authChecker: AuthChecker<DokkuContext> = async ({
  context,
}): Promise<boolean> => {
  if (!context.auth) return false;
  const settings = await context.prisma.settings.findFirst();
  const user = await context.prisma.user.findUnique({
    where: { id: context.auth.userId },
  });

  if (!(settings?.allowedEmails?.includes(user.email) ?? false)) return false;

  return true;
};
