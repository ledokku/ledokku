import { prisma } from './../../prisma';
import { QueryResolvers } from '../../generated/graphql';
import { sshConnect } from '../../lib/ssh';
import { dokku } from '../../lib/dokku';

export const domains: QueryResolvers['domains'] = async (
  _,
  { appId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const app = await prisma.app.findOne({
    where: { id: appId },
  });

  const ssh = await sshConnect();

  const domainsReturned = await dokku.domains.report(ssh, app.name);
  console.log(domainsReturned);

  console.log(domains);

  const realDomains = ['hello', 'hello'];

  return { domains: realDomains };
};
