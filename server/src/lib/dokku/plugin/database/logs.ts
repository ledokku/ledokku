import NodeSsh from 'node-ssh';

const parseDatabaseLogsCommand = (commandResult: string) => {
  const databaseLogs = commandResult.split('\n');
  const logs = [];
  // We remove first line as it is not necessary for us
  databaseLogs.shift();
  databaseLogs.map((dblog) => {
    dblog.trim();
    // We do not push empty lines to array
    dblog !== '' && logs.push(dblog);
  });
  // We return array for the ease of parsing
  return logs;
};

export const logs = async (
  ssh: NodeSsh,
  databaseName: string,
  databaseType: string
) => {
  const resultDatabaseInfo = await ssh.execCommand(
    `${databaseType}:logs ${databaseName}`
  );
  if (resultDatabaseInfo.code === 1) {
    console.error(resultDatabaseInfo);
    throw new Error(resultDatabaseInfo.stderr);
  }

  return parseDatabaseLogsCommand(resultDatabaseInfo.stdout);
};
