import NodeSsh from 'node-ssh';

const parseDatabaseLogsCommand = (commandResult: string) => {
  const databaseLogs = commandResult.split('\n');
  let logs = [];
  databaseLogs.map((dblog) => {
    dblog.trim();
    logs.push(dblog);
  });
  // We return array for the ease of parsing
  return logs;
};

export const info = async (
  ssh: NodeSsh,
  databaseName: string,
  databaseType: string
) => {
  const resultDatabaseInfo = await ssh.execCommand(
    `${databaseType}:info ${databaseName}`
  );
  if (resultDatabaseInfo.code === 1) {
    console.error(resultDatabaseInfo);
    throw new Error(resultDatabaseInfo.stderr);
  }

  return parseDatabaseLogsCommand(resultDatabaseInfo.stdout);
};
