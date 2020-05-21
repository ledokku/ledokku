import NodeSsh from 'node-ssh';

const parseLogsCommand = (commandResult: string) => {
  const allLogs = commandResult.split('\u001b');
  //We remove redundnat chars from good log & pick only 3rd item in array
  //which is a good log
  const logs = allLogs[2].slice(4);
  return logs;
};

export const logs = async (ssh: NodeSsh, name: string) => {
  const resultAppLogs = await ssh.execCommand(`logs ${name}`);
  console.log(resultAppLogs);
  if (resultAppLogs.code === 1) {
    throw new Error(resultAppLogs.stderr);
  }

  return parseLogsCommand(resultAppLogs.stdout);
};
