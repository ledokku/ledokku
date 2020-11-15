import { NodeSSH, SSHExecOptions } from 'node-ssh';

export const restart = async (
  ssh: NodeSSH,
  name: string,
  options?: SSHExecOptions
) => {
  const resultAppRestart = await ssh.execCommand(`ps:restart ${name}`, options);

  return resultAppRestart;
};
