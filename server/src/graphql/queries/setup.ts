import { readFileSync } from 'fs';
import { QueryResolvers } from '../../generated/graphql';
import { config } from '../../config';
import { sshConnect } from '../../lib/ssh';

export const setup: QueryResolvers['setup'] = async () => {
  const publicKey = readFileSync(`${config.sshKeyPath}.pub`, {
    encoding: 'utf8',
  });

  let canConnectSsh = false;
  try {
    await sshConnect();
    canConnectSsh = true;
  } catch (error) {
    // We do nothing as canConnectSsh is false
  }

  return {
    canConnectSsh,
    sshPublicKey: publicKey,
  };
};
