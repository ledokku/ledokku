import NodeSsh from 'node-ssh';

export const deleteEnvVar = async (ssh: NodeSsh, name: string, key: string) => {
  const resultDeleteEnv = await ssh.execCommand(`config:unset ${name} ${key}`);

  if (resultDeleteEnv.code === 1) {
    throw new Error(resultDeleteEnv.stderr);
  }

  return resultDeleteEnv.stdout;
};
