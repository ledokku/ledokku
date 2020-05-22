import NodeSsh from 'node-ssh';

const parseEnvVarsCommand = (commandResult: string) => {
  const envVars = commandResult.split('\n');
  // We remove the first line because it's not related to env vars
  envVars.splice(0, 1);

  return envVars.map((envVar) => {
    // We split with colon and space, because just colon would mess up links
    const split = envVar.split(': ');
    return {
      key: split[0],
      value: split[1].trim(),
    };
  });
};

export const env = async (ssh: NodeSsh, name: string) => {
  const resultEnv = await ssh.execCommand(`config ${name}`);

  if (resultEnv.code === 1) {
    throw new Error(resultEnv.stderr);
  }
  console.log(parseEnvVarsCommand(resultEnv.stdout));
  return parseEnvVarsCommand(resultEnv.stdout);
};
