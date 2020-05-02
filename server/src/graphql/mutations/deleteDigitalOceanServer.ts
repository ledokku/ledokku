import fetch from 'node-fetch';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from './../../prisma';

export const deleteDigitalOceanServer: MutationResolvers['deleteDigitalOceanServer'] = async (
  _,
  { serverId },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }

  if (!serverId) {
    throw new Error('Server id is required');
  }
  // We get current user
  const currentUser = await prisma.user.findOne({
    where: {
      id: userId,
    },
  });

  // We get the server to delete
  const serverToDelete = await prisma.server.findOne({
    where: {
      id: serverId,
    },
  });

  // We check whether userId of server is the same as current user
  if (serverToDelete.userId === currentUser.id) {
    try {
      const res = await fetch(
        // TODO resolve naming issue with serverId being argument to this mutation
        // and also field at Server schema
        `https://api.digitalocean.com/v2/droplets/${serverToDelete.serverId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.digitaloceanAccessToken}`,
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        }
      );
      const resStatus = await res.status;

      if (resStatus === 204) {
        await prisma.server.delete({
          where: {
            id: serverId,
          },
        });
        return true;
      } else {
        throw new Error(
          `Server deletion response failed with status :${resStatus}`
        );
      }
    } catch (e) {
      throw new Error(e.message);
    }
  }
};
