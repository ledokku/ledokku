import fetch from 'node-fetch';
import * as yup from 'yup';
import Crypto from 'crypto';
import sshpk from 'sshpk';
import { MutationResolvers } from '../../generated/graphql';
import { prisma } from './../../prisma';

const createDigitalOceanServerSchema = yup.object({
  serverName: yup.string().required(),
});

export const createDigitalOceanServer: MutationResolvers['createDigitalOceanServer'] = async (
  _,
  { serverName },
  { userId }
) => {
  if (!userId) {
    throw new Error('Unauthorized');
  }
  const currentUser = await prisma.user.findOne({
    where: {
      id: userId,
    },
  });
  if (!currentUser.digitaloceanAccessToken) {
    throw new Error('Digitalocean token required');
  }

  // We make sure the name is valid to avoid security risks
  createDigitalOceanServerSchema.validateSync({ serverName });

  // check to see whether can follow the action
  // ACTION STATE
  // The current status of the action. This can be "in-progress", "completed", or "errored".

  //   create public and private ssh key
  const { privateKey, publicKey } = Crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  // parse ssh
  const pemKey = sshpk.parseKey(publicKey, 'pem');
  const sshRsa = pemKey.toString('ssh');
  const sshKeyPrivateKey = sshpk
    .parsePrivateKey(privateKey, 'pem')
    .toString('ssh');

  let publicKeyId;

  // fetch ssh id
  try {
    const resSsh = await fetch('https://api.digitalocean.com/v2/account/keys', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentUser.digitaloceanAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `ledokku-${serverName}`,
        public_key: sshRsa,
      }),
    });
    const sshData = await resSsh.json();

    publicKeyId = sshData.ssh_key.id;
  } catch (e) {
    console.error(e);
    throw new Error('Request failed');
  }

  const sshKey = await prisma.sshKey.create({
    data: {
      privateKey: sshKeyPrivateKey,
      digitaloceanId: publicKeyId,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  try {
    const res = await fetch('https://api.digitalocean.com/v2/droplets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentUser.digitaloceanAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `ledokku-${serverName}`,
        region: 'nyc3',
        size: 's-1vcpu-1gb',
        image: 'docker-18-04',
        ssh_keys: [sshKey.digitaloceanId],
        backups: false,
        ipv6: true,
        user_data: null,
        private_networking: null,
        volumes: null,
        tags: ['web'],
      }),
    });

    const resData = await res.json();
    console.log(resData);

    if (resData && resData.droplet && resData.links) {
      const actionLink = resData.links.actions[0].href;
      const actionResponse = await fetch(actionLink, {
        headers: {
          Authorization: `Bearer ${currentUser.digitaloceanAccessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const action = await actionResponse.json();
      console.log('action', action);

      const newServer = await prisma.server.create({
        data: {
          name: serverName,
          serverId: resData.droplet.id,
          type: 'DIGITALOCEAN',
          status: 'NEW',
          actionId: resData.links.actions[0].id,
          user: {
            connect: {
              id: userId,
            },
          },
          sshKey: {
            connect: {
              id: sshKey.id,
            },
          },
        },
      });
      console.log(newServer);
      return newServer;
    }
    throw new Error('Request failed');
  } catch (error) {
    console.error(error);
    throw new Error('Request failed');
  }
};
