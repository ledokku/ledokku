import NodeSsh from 'node-ssh';

export const unset = async (ssh: NodeSsh, name: string, key: string) => {
  const resultUnsetEnv = await ssh.execCommand(`config:unset ${name} ${key}`);

  if (resultUnsetEnv.code === 1) {
    throw new Error(resultUnsetEnv.stderr);
  }
};
