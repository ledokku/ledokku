import NodeSsh from 'node-ssh';

const parseLogsCommand = (commandResult: string) => {
  // We split logs into array by new line
  const allLogs = commandResult.split('\n');
  const logs = [];
  allLogs.map((log) => {
    // We remove long miliseconds part from timestamp so
    // "2020-08-15T11:11:16.438958667Z" => "2020-08-15T11:11:16"
    const dotIndex = log.indexOf('.');
    const subStr = log.substring(dotIndex, dotIndex + 11);
    const logWitCleanTimeStamp = log.replace(subStr, '');
    // We remove two chars that doesn't provide any useful information
    const cleanLog = logWitCleanTimeStamp.replace('36m', '');
    const newLog = cleanLog.replace('[0m', '');
    logs.push(newLog);
  });
  return logs;
};

export const logs = async (ssh: NodeSsh, name: string) => {
  const resultAppLogs = await ssh.execCommand(`logs ${name}`);
  if (resultAppLogs.code === 1) {
    throw new Error(resultAppLogs.stderr);
  }

  return parseLogsCommand(resultAppLogs.stdout);
};
