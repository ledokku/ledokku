import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH, SSHExecOptions } from 'node-ssh';
import { EnvVar } from './models/env_var.model';

@Injectable()
export class DokkuAppRepository {
  async create(
    ssh: NodeSSH,
    appName: string,
    options?: SSHExecOptions
  ): Promise<boolean> {
    const resultAppsCreate = await ssh.execCommand(
      `apps:create ${appName}`,
      options
    );

    if (resultAppsCreate.code === 1) {
      throw new InternalServerError(resultAppsCreate.stderr);
    }

    return true;
  }

  async destroy(ssh: NodeSSH, appName: string): Promise<boolean> {
    const resultAppsDestroy = await ssh.execCommand(
      `--force apps:destroy ${appName}`
    );
    if (resultAppsDestroy.code === 1) {
      throw new InternalServerError(resultAppsDestroy.stderr);
    }

    return true;
  }

  async setDockerfilePath(
    ssh: NodeSSH,
    appName: string,
    path: string
  ): Promise<boolean> {
    const resultAppsDestroy = await ssh.execCommand(
      `builder-dockerfile:set ${appName} dockerfile-path ${path}`
    );
    if (resultAppsDestroy.code === 1) {
      throw new InternalServerError(resultAppsDestroy.stderr);
    }

    return true;
  }

  async list(ssh: NodeSSH): Promise<string[]> {
    const resultAppsCreate = await ssh.execCommand(`apps:list`);
    if (resultAppsCreate.code === 1) {
      console.error(resultAppsCreate);
      throw new Error(resultAppsCreate.stderr);
    }

    const apps = resultAppsCreate.stdout.split('\n');

    apps.shift();
    return apps;
  }

  async logs(ssh: NodeSSH, appName: string): Promise<string[]> {
    const resultAppLogs = await ssh.execCommand(`logs ${appName}`);
    if (resultAppLogs.code === 1) {
      throw new InternalServerError(resultAppLogs.stderr);
    }

    return resultAppLogs.stdout.split('\n');
  }

  async envVars(ssh: NodeSSH, appName: string): Promise<EnvVar[]> {
    const resultListEnv = await ssh.execCommand(`config ${appName}`);

    if (resultListEnv.code === 1) {
      throw new Error(resultListEnv.stderr);
    }

    const envVars = resultListEnv.stdout.split('\n');
    envVars.splice(0, 1);

    console.log(envVars);

    return envVars.map((envVar) => {
      const split = envVar.split(':');
      return {
        key: split[0],
        value: split[1].trim(),
      };
    });
  }

  async setEnvVar(
    ssh: NodeSSH,
    appName: string,
    envVars: { key: string; value: string } | { key: string; value: string }[],
    { noRestart }: { noRestart: boolean } = { noRestart: false },
    encoded?: boolean
  ): Promise<boolean> {
    if (!Array.isArray(envVars)) {
      envVars = [envVars];
    }

    const resultSetEnv = await ssh.execCommand(
      `config:set ${noRestart ? '--no-restart' : ''} ${
        encoded ? '--encoded' : ''
      } ${appName} ${envVars.map((data) => ` ${data.key}=${data.value}`)}`
    );

    if (resultSetEnv.code === 1) {
      throw new InternalServerError(resultSetEnv.stderr);
    }

    return true;
  }

  async unsetEnvVar(
    ssh: NodeSSH,
    appName: string,
    key: string
  ): Promise<boolean> {
    const resultUnsetEnv = await ssh.execCommand(
      `config:unset ${appName} ${key}`
    );

    if (resultUnsetEnv.code === 1) {
      throw new InternalServerError(resultUnsetEnv.stderr);
    }

    return true;
  }

  async rebuild(ssh: NodeSSH, appName: string, options?: SSHExecOptions) {
    const resultAppRebuild = await ssh.execCommand(
      `ps:rebuild ${appName}`,
      options
    );

    return resultAppRebuild;
  }

  async restart(ssh: NodeSSH, appName: string, options?: SSHExecOptions) {
    const resultAppRestart = await ssh.execCommand(
      `ps:restart ${appName}`,
      options
    );

    return resultAppRestart;
  }
}
