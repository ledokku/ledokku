import fetch from 'node-fetch';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';

export const updateServerInfo: MutationResolvers['updateServerInfo'] = async (
  _,
  { serverId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // get current user
  const currentUser = await prisma.user.findOne({
    where: {
      id: userId,
    },
  });
  // get current server
  const currentServer = await prisma.server.findOne({
    where: {
      id: serverId,
    },
  });

  try {
    const actionData = await fetch(
      `https://api.digitalocean.com/v2/actions/${currentServer.actionId}`,
      {
        headers: {
          Authorization: `Bearer ${currentUser.digitaloceanAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const actionResponse = await actionData.json();
    // if completed fetch droplet add ip, remove actionid
    if (actionResponse.action.status === 'completed') {
      try {
        const dropletData = await fetch(
          `https://api.digitalocean.com/v2/droplets/${actionResponse.action.resource_id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser.digitaloceanAccessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const dropletResponse = await dropletData.json();

        await prisma.server.update({
          where: {
            id: serverId,
          },
          data: {
            ip: dropletResponse.droplet.networks.v4[0].ip_address,
            actionId: null,
          },
        });
        return true;
      } catch (e) {
        console.error(e);
        throw new Error('Request failed');
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error('failed to update server info');
  }
};
