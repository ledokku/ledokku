import { NodeSSH } from 'node-ssh';

export const set = async (
  ssh: NodeSSH,
  name: string,
  key: string,
  value: string
) => {
  const resultSetEnv = await ssh.execCommand(
    `config:set ${name} ${key}=${value}`
  );

  if (resultSetEnv.code === 1) {
    throw new Error(resultSetEnv.stderr);
  }
};
