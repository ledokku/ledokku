import { DOKKU_SSH_USERNAME, DOKKU_SSH_PASSWORD } from './../constants';
import { NodeSSH, SSHExecCommandResponse, SSHExecOptions } from 'node-ssh';
import { DOKKU_SSH_HOST, DOKKU_SSH_PORT } from '../constants';
import { privateKey } from './../config';

export const sshConnect = async () => {
  const ssh = new NodeSSH();

  await ssh.connect({
    host: DOKKU_SSH_HOST,
    port: DOKKU_SSH_PORT,
    username: DOKKU_SSH_USERNAME,
    privateKey: privateKey,
    password: DOKKU_SSH_PASSWORD,
    tryKeyboard: !!DOKKU_SSH_PASSWORD,
  });

  return ssh;
};

export async function execSSHCommand<T>(
  command: string,
  options?: SSHExecOptions
): Promise<SSHExecCommandResponse> {
  const ssh = await sshConnect();

  const res = await ssh.execCommand(
    `${
      DOKKU_SSH_USERNAME !== 'dokku'
        ? `printf "${DOKKU_SSH_PASSWORD}\n" | sudo -S dokku `
        : ''
    }${command}`,
    options
  );

  ssh.dispose();

  return res;
}
