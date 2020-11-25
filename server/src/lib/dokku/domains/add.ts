import { NodeSSH } from 'node-ssh';

export const add = async (ssh: NodeSSH, name: string, domain: string) => {
  const resultSetEnv = await ssh.execCommand(
    `domains:add ${name} ${name} ${domain}`
  );

  if (resultSetEnv.code === 1) {
    throw new Error(resultSetEnv.stderr);
  }
};
