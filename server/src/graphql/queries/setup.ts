import { readFileSync } from 'fs';
import createDebug from 'debug';
import { QueryResolvers } from '../../generated/graphql';
import { config } from '../../config';
import { sshConnect } from '../../lib/ssh';

const debug = createDebug(`queries:setup`);

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
    debug(error);
  }

  return {
    canConnectSsh,
    sshPublicKey: publicKey,
  };
};
