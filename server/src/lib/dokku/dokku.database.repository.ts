import { DbTypes } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH, SSHExecOptions } from 'node-ssh';
import { injectable } from 'tsyringe';
import { dbTypeToDokkuPlugin } from '../../graphql/utils';

@Injectable()
@injectable()
export class DokkuDatabaseRepository {
  async create(
    ssh: NodeSSH,
    name: string,
    databaseType: string,
    options?: SSHExecOptions
  ) {
    const resultDatabaseCreate = await ssh.execCommand(
      `${databaseType}:create ${name}`,
      options
    );

    return resultDatabaseCreate;
  }

  async destroy(
    ssh: NodeSSH,
    databaseName: string,
    databaseType: DbTypes
  ): Promise<boolean> {
    const resultDatabaseDestroy = await ssh.execCommand(
      `--force ${dbTypeToDokkuPlugin(databaseType)}:destroy ${databaseName}`
    );

    if (resultDatabaseDestroy.code === 1) {
      throw new InternalServerError(resultDatabaseDestroy.stderr);
    }

    return true;
  }

  async version(
    ssh: NodeSSH,
    databaseName: string,
    databaseType: DbTypes
  ): Promise<string> {
    const resultDatabaseInfo = await ssh.execCommand(
      `${dbTypeToDokkuPlugin(databaseType)}:info ${databaseName} --version`
    );
    if (resultDatabaseInfo.code === 1) {
      console.error(resultDatabaseInfo);
      throw new Error(resultDatabaseInfo.stderr);
    }

    return resultDatabaseInfo.stdout;
  }

  async link(
    ssh: NodeSSH,
    databaseName: string,
    databaseType: string,
    appName: string,
    options?: SSHExecOptions
  ) {
    const resultDatabaseLink = await ssh.execCommand(
      `${databaseType}:link ${databaseName} ${appName}`,
      options
    );

    return resultDatabaseLink;
  }

  async unlink(
    ssh: NodeSSH,
    databaseName: string,
    databaseType: string,
    appName: string,
    options?: SSHExecOptions
  ) {
    const resultDatabaseUnLink = await ssh.execCommand(
      `${databaseType}:unlink ${databaseName} ${appName}`,
      options
    );

    return resultDatabaseUnLink;
  }

  async links(
    ssh: NodeSSH,
    databaseType: string,
    databaseName: string
  ): Promise<string[]> {
    const resultDatabaseLinks = await ssh.execCommand(
      `${databaseType}:links ${databaseName}`
    );

    if (resultDatabaseLinks.code === 1) {
      console.error(resultDatabaseLinks);
      throw new InternalServerError(resultDatabaseLinks.stderr);
    }

    return resultDatabaseLinks.stdout.split('\n');
  }

  async list(ssh: NodeSSH, databaseType: string): Promise<string[]> {
    const resultAppsCreate = await ssh.execCommand(`${databaseType}:list`);
    if (resultAppsCreate.code === 1) {
      console.error(resultAppsCreate);
      throw new Error(resultAppsCreate.stderr);
    }

    const apps = resultAppsCreate.stdout.split('\n');
    apps.shift();
    return apps;
  }

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
