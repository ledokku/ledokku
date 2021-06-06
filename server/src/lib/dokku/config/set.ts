import { NodeSSH } from 'node-ssh';

export const set = async (
  ssh: NodeSSH,
  name: string,
  values: { key: string; value: string } | { key: string; value: string }[],
  { noRestart }: { noRestart: boolean } = { noRestart: false }
) => {
  if (!Array.isArray(values)) {
    values = [values];
  }

  const resultSetEnv = await ssh.execCommand(
    `config:set ${noRestart ? '--no-restart' : ''} ${name} ${values.map(
      (data) => ` ${data.key}=${data.value}`
    )}`
  );

  if (resultSetEnv.code === 1) {
    throw new Error(resultSetEnv.stderr);
  }
};
