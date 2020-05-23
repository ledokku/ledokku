import NodeSsh from 'node-ssh';

export const add = async (
  ssh: NodeSsh,
  name: string,
  key: string,
  value: string
) => {
  const resultAddEnv = await ssh.execCommand(
    `config:set ${name} ${key}=${value}`
  );

  if (resultAddEnv.code === 1) {
    throw new Error(resultAddEnv.stderr);
  }

  return resultAddEnv.stdout;
};
