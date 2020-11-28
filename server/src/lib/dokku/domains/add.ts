import { NodeSSH } from 'node-ssh';

export const add = async (ssh: NodeSSH, name: string, domainName: string) => {
  const resultAddDomain = await ssh.execCommand(
    `domains:add ${name} ${domainName}`
  );

  if (resultAddDomain.code === 1) {
    throw new Error(resultAddDomain.stderr);
  }
};
