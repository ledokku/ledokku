import NodeSsh from 'node-ssh';

export const create = async (ssh: NodeSsh, name: string) => {
  const resultPostgresCreate = await ssh.execCommand(`postgres:create ${name}`);
  if (resultPostgresCreate.code === 1) {
    console.error(resultPostgresCreate);
    throw new Error(resultPostgresCreate.stderr);
  }
};
