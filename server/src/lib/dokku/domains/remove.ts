import { NodeSSH } from 'node-ssh';

export const remove = async (
  ssh: NodeSSH,
  name: string,
  domainName: string
) => {
  const resultRemoveDomain = await ssh.execCommand(
    `domains:remove ${name} ${domainName}`
  );

  if (resultRemoveDomain.code === 1) {
    throw new Error(resultRemoveDomain.stderr);
  }
};
