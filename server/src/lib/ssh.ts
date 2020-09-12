import { NodeSSH } from 'node-ssh';
import { config } from '../config';

export const sshConnect = async () => {
  const ssh = new NodeSSH();

  await ssh.connect({
    host: config.dokkuSshHost,
    port: config.dokkuSshPort,
    username: 'dokku',
    privateKey: config.privateKey,
  });

  return ssh;
};
