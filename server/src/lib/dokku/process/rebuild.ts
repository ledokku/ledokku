import { NodeSSH, SSHExecOptions } from 'node-ssh';

export const rebuild = async (
  ssh: NodeSSH,
  name: string,
  options?: SSHExecOptions
) => {
  const resultAppRebuild = await ssh.execCommand(`ps:rebuild ${name}`, options);

  return resultAppRebuild;
};
