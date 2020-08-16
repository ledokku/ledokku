import NodeSsh from 'node-ssh';

const parseLogsCommand = (commandResult: string) => {
  const allLogs = commandResult.split('\n');
  const logs = [];
  //We remove redundnat chars from good log & pick only 3rd item in array
  //which is a good log
  allLogs.map((log) => {
    const dotIndex = log.indexOf('.');
    const subStr = log.substring(dotIndex, dotIndex + 11);
    const logWitCleanTimeStamp = log.replace(subStr, '');
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
