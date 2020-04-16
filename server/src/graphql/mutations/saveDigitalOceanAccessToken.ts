import fetch from 'node-fetch';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const saveDigitalOceanAccessToken: MutationResolvers['saveDigitalOceanAccessToken'] = async (
  _,
  { digitalOceanAccessToken },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const resData = await fetch('https://api.digitalocean.com/v2/account', {
      headers: {
        Authorization: `Bearer ${digitalOceanAccessToken}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());

    // we check if user account is active
    if (resData && resData.account && resData.account.status === 'active') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          digitaloceanAccessToken: digitalOceanAccessToken,
        },
      });
      return true;
    }
  } catch (e) {
    console.error(e);
    throw new Error('Saving digital ocean access token failed');
  }

  return false;
};
