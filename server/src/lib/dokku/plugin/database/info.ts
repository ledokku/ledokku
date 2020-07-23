import NodeSsh from 'node-ssh';

const parseDatabaseInfoCommand = (commandResult: string) => {
  const databaseLogs = commandResult.split('\n');
  const info = [];
  // We remove first line as it is not necessary for us
  databaseLogs.shift();
  databaseLogs.map((infoLine) => {
    infoLine.trim();
    info.push(infoLine);
  });
  // We return array for the ease of parsing
  return info;
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

  return parseDatabaseInfoCommand(resultDatabaseInfo.stdout);
};
