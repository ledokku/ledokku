import { NodeSSH } from 'node-ssh';

export const report = async (ssh: NodeSSH, name: string) => {
  const resultSetEnv = await ssh.execCommand(`domains:report ${name} ${name}`);

  if (resultSetEnv.code === 1) {
    throw new Error(resultSetEnv.stderr);
  }
};
