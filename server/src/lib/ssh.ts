import { NodeSSH, SSHExecCommandResponse, SSHExecOptions } from 'node-ssh';
import { DOKKU_SSH_HOST, DOKKU_SSH_PORT } from '../constants';
import { privateKey } from './../config';

export const sshConnect = async () => {
  const ssh = new NodeSSH();

  await ssh.connect({
    host: DOKKU_SSH_HOST,
    port: DOKKU_SSH_PORT,
    username: 'dokku',
    privateKey: privateKey,
  });

  return ssh;
};

export async function execSSHCommand<T>(
  command: string,
  options?: SSHExecOptions
): Promise<SSHExecCommandResponse> {
  const ssh = await sshConnect();

  const res = await ssh.execCommand(command, options);

  ssh.dispose();

  return res;
}
