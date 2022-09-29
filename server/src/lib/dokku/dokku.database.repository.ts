import { DbTypes } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH } from 'node-ssh';
import { injectable } from 'tsyringe';
import { dbTypeToDokkuPlugin } from '../../graphql/utils';

@Injectable()
@injectable()
export class DokkuDatabaseRepository {
  async database(
    ssh: NodeSSH,
    dbName: string,
    dbType: DbTypes
  ): Promise<string[]> {
    const resultDatabaseInfo = await ssh.execCommand(
      `${dbTypeToDokkuPlugin(dbType)}:info ${dbName}`
    );
    if (resultDatabaseInfo.code === 1) {
      throw new InternalServerError(resultDatabaseInfo.stderr);
    }

    const databaseLogs = resultDatabaseInfo.stdout.split('\n');
    const info = [];

    databaseLogs.shift();
    databaseLogs.map((infoLine) => {
      infoLine.trim();
      info.push(infoLine);
    });

    return info;
  }

  async logs(ssh: NodeSSH, dbName: string, dbType: DbTypes): Promise<string[]> {
    const resultDatabaseInfo = await ssh.execCommand(
      `${dbTypeToDokkuPlugin(dbType)}:logs ${dbName}`
    );
    if (resultDatabaseInfo.code === 1) {
      throw new InternalServerError(resultDatabaseInfo.stderr);
    }

    const databaseLogs = resultDatabaseInfo.stdout.split('\n');
    const logs = [];

    databaseLogs.shift();
    databaseLogs.map((dblog) => {
      dblog.trim();

      dblog !== '' && logs.push(dblog);
    });

    return logs;
  }
}
