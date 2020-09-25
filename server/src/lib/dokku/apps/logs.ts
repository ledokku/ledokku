import { NodeSSH } from 'node-ssh';

const parseLogsCommand = (commandResult: string) => {
  // We split logs into array by new line
  return commandResult.split('\n');
};

export const logs = async (ssh: NodeSSH, name: string) => {
  const resultAppLogs = await ssh.execCommand(`logs ${name}`);
  if (resultAppLogs.code === 1) {
    throw new Error(resultAppLogs.stderr);
  }

  return parseLogsCommand(resultAppLogs.stdout);
};
