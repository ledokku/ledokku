import fetch from 'node-fetch';
import { QueryResolvers } from '../../generated/graphql';
import { prisma } from '../../prisma';
import { createServerQueue } from '../../queues/createServer';

export const server: QueryResolvers['server'] = async (
  _,
  { id },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findOne({
    where: { id: userId },
    select: { id: true, digitaloceanAccessToken: true },
  });

  const server = await prisma.server.findOne({
    where: { id },
  });

  // If actionId is there it means creation is still pending
  // We update the status
  if (server.actionId) {
    const actionData = await fetch(
      `https://api.digitalocean.com/v2/actions/${server.actionId}`,
      {
        headers: {
          Authorization: `Bearer ${user.digitaloceanAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const actionResponse = await actionData.json();
    console.log('actionResponse', actionResponse);
    // if completed fetch droplet add ip, remove actionid
    if (actionResponse.action.status === 'completed') {
      const dropletData = await fetch(
        `https://api.digitalocean.com/v2/droplets/${actionResponse.action.resource_id}`,
        {
          headers: {
            Authorization: `Bearer ${user.digitaloceanAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const dropletResponse = await dropletData.json();

      await prisma.server.update({
        where: {
          id: server.id,
        },
        data: {
          ip: dropletResponse.droplet.networks.v4[0].ip_address,
          actionId: null,
        },
      });

      const action = await prisma.action.create({
        data: {
          status: 'PENDING',
          type: 'SETUP_SERVER',
          server: {
            connect: { id: server.id },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // We trigger the queue that will add dokku to the server
      await createServerQueue.add('create-server', { actionId: action.id });
    }
  }

  // TODO limit by userID (cannot access another user server)
  return server;
};
