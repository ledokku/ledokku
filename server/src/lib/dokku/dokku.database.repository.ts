import { DbTypes } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH, SSHExecOptions } from 'node-ssh';
import { dbTypeToDokkuPlugin } from '../../config/utils';
import { execSSHCommand } from '../ssh';

@Injectable()
export class DokkuDatabaseRepository {
  async create(name: string, databaseType: DbTypes, options?: SSHExecOptions) {
    const resultDatabaseCreate = await execSSHCommand(
      `${dbTypeToDokkuPlugin(databaseType)}:create ${name}`,
      options
    );

    return resultDatabaseCreate;
  }

  async destroy(databaseName: string, databaseType: DbTypes): Promise<boolean> {
    const resultDatabaseDestroy = await execSSHCommand(
      `--force ${dbTypeToDokkuPlugin(databaseType)}:destroy ${databaseName}`
    );

    if (resultDatabaseDestroy.code === 1) {
      throw new InternalServerError(resultDatabaseDestroy.stderr);
    }

    return true;
  }

  async version(databaseName: string, databaseType: DbTypes): Promise<string> {
    const resultDatabaseInfo = await execSSHCommand(
      `${dbTypeToDokkuPlugin(databaseType)}:info ${databaseName} --version`
    );
    if (resultDatabaseInfo.code === 1) {
      console.error(resultDatabaseInfo);
      throw new Error(resultDatabaseInfo.stderr);
    }

    return resultDatabaseInfo.stdout;
  }

  async link(
    databaseName: string,
    databaseType: DbTypes,
    appName: string,
    options?: SSHExecOptions
  ) {
    const resultDatabaseLink = await execSSHCommand(
      `${dbTypeToDokkuPlugin(databaseType)}:link ${databaseName} ${appName}`,
      options
    );

    return resultDatabaseLink;
  }

  async unlink(
    databaseName: string,
    databaseType: DbTypes,
    appName: string,
    options?: SSHExecOptions
  ) {
    const resultDatabaseUnLink = await execSSHCommand(
      `${dbTypeToDokkuPlugin(databaseType)}:unlink ${databaseName} ${appName}`,
      options
    );

    return resultDatabaseUnLink;
  }

  async links(databaseType: DbTypes, databaseName: string): Promise<string[]> {
    const resultDatabaseLinks = await execSSHCommand(
      `${dbTypeToDokkuPlugin(databaseType)}:links ${databaseName}`
    );

    if (resultDatabaseLinks.code === 1) {
      console.error(resultDatabaseLinks);
      throw new InternalServerError(resultDatabaseLinks.stderr);
    }

    return resultDatabaseLinks.stdout.split('\n');
  }

  async list(databaseType: DbTypes): Promise<string[]> {
    const resultAppsCreate = await execSSHCommand(
      `${dbTypeToDokkuPlugin(databaseType)}:list`
    );
    if (resultAppsCreate.code === 1) {
      console.error(resultAppsCreate);
      throw new Error(resultAppsCreate.stderr);
    }

    const apps = resultAppsCreate.stdout.split('\n');
    apps.shift();
    return apps;
  }

  async database(dbName: string, dbType: DbTypes): Promise<string[]> {
    const resultDatabaseInfo = await execSSHCommand(
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

  async logs(dbName: string, dbType: DbTypes): Promise<string[]> {
    const resultDatabaseInfo = await execSSHCommand(
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
