import { $log } from '@tsed/common';
import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import e from 'express';
import { NodeSSH, SSHExecOptions } from 'node-ssh';
import { execSSHCommand } from '../ssh';
import { EnvVar } from './models/env_var.model';

@Injectable()
export class DokkuAppRepository {
  async create(appName: string, options?: SSHExecOptions): Promise<boolean> {
    const resultAppsCreate = await execSSHCommand(
      `apps:create ${appName}`,
      options
    );

    if (resultAppsCreate.code === 1) {
      throw new InternalServerError(resultAppsCreate.stderr);
    }

    return true;
  }

  async destroy(appName: string): Promise<boolean> {
    const resultAppsDestroy = await execSSHCommand(
      `--force apps:destroy ${appName}`
    );
    if (resultAppsDestroy.code === 1) {
      throw new InternalServerError(resultAppsDestroy.stderr);
    }

    return true;
  }

  async setBuilder(
    appName: string,
    builder: 'dockerfile' | 'herokuish'
  ): Promise<boolean> {
    const resultAppsDestroy = await execSSHCommand(
      `builder:set ${appName} selected ${builder}`
    );
    if (resultAppsDestroy.code === 1) {
      throw new InternalServerError(resultAppsDestroy.stderr);
    }

    return true;
  }

  async enableSSL(appName: string): Promise<boolean> {
    $log.info(`Habilitando SSL para la app ${appName}...`);

    await this.setEnvVar(appName, {
      key: 'DOKKU_LETSENCRYPT_EMAIL',
      value: 'contacto@ocstudios.mx',
    });

    const resultAppsDestroy = await execSSHCommand(
      `letsencrypt:active ${appName} || letsencrypt:enable ${appName}`
    );

    $log.info(resultAppsDestroy.stdout);
    if (resultAppsDestroy.code === 1) {
      $log.warn(resultAppsDestroy.stderr);
      throw new InternalServerError(resultAppsDestroy.stderr);
    }

    return true;
  }

  async setDockerfilePath(appName: string, path: string): Promise<boolean> {
    await this.setBuilder(appName, 'dockerfile');
    await this.unsetEnvVar(appName, 'DOKKU_PROXY_PORT_MAP', false).catch((e) =>
      console.log(e)
    );

    const resultAppsDestroy = await execSSHCommand(
      `builder-dockerfile:set ${appName} dockerfile-path ${path}`
    );
    if (resultAppsDestroy.code === 1) {
      throw new InternalServerError(resultAppsDestroy.stderr);
    }

    return true;
  }

  async list(): Promise<string[]> {
    const resultAppsCreate = await execSSHCommand(`apps:list`);
    if (resultAppsCreate.code === 1) {
      console.error(resultAppsCreate);
      throw new Error(resultAppsCreate.stderr);
    }

    const apps = resultAppsCreate.stdout.split('\n');

    apps.shift();
    return apps;
  }

  async changeBranch(appName: string, branchName: string): Promise<boolean> {
    const resultAppLogs = await execSSHCommand(
      `git:set ${appName} deploy-branch ${branchName}`
    );

    $log.info(resultAppLogs.stdout);

    if (resultAppLogs.code === 1) {
      throw new InternalServerError(resultAppLogs.stderr);
    }

    return true;
  }

  async logs(appName: string): Promise<string[]> {
    const resultAppLogs = await execSSHCommand(`logs ${appName}`);
    if (resultAppLogs.code === 1) {
      throw new InternalServerError(resultAppLogs.stderr);
    }

    return resultAppLogs.stdout.split('\n');
  }

  async envVars(appName: string): Promise<EnvVar[]> {
    const resultListEnv = await execSSHCommand(`config ${appName}`);

    if (resultListEnv.code === 1) {
      throw new Error(resultListEnv.stderr);
    }

    const envVars = resultListEnv.stdout.split('\n');
    envVars.splice(0, 1);

    const buildArgs = await this.buildArgs(appName);

    return envVars.map((envVar) => {
      const split = envVar.split(':');
      return {
        key: split[0],
        value: split.slice(1).join(':').trim(),
        asBuildArg: !!buildArgs.find((it) => {
          try {
            return RegExp(
              `^--build-arg ${split[0]}=${split.slice(1).join(':').trim()}$`
            ).test(it);
          } catch (e) {
            return false;
          }
        }),
      };
    });
  }

  async setEnvVar(
    appName: string,
    envVars: { key: string; value: string } | { key: string; value: string }[],
    { noRestart }: { noRestart: boolean } = { noRestart: false },
    encoded?: boolean,
    asBuildArg?: boolean
  ): Promise<boolean> {
    if (!Array.isArray(envVars)) {
      envVars = [envVars];
    }

    if (asBuildArg) {
      for (const env of envVars) {
        try {
          RegExp(`^--build-arg ${env.key}=${env.value}$`).test(
            `--build-arg ${env.key}=${env.value}`
          );

          await execSSHCommand(
            `docker-options:add ${appName} build '--build-arg ${env.key}=${env.value}'`
          );
        } catch (e) {}
      }
    } else {
      for (const env of envVars) {
        await this.unsetBuildArg(appName, env.key);
      }
    }

    const resultSetEnv = await execSSHCommand(
      `config:set ${noRestart ? '--no-restart' : ''} ${
        encoded ? '--encoded' : ''
      } ${appName} ${envVars.map((data) => ` ${data.key}=${data.value}`)}`
    );

    if (resultSetEnv.code === 1) {
      throw new InternalServerError(resultSetEnv.stderr);
    }

    return true;
  }

  async buildArgs(appName: string): Promise<string[]> {
    const args = await execSSHCommand(
      `docker-options:report ${appName} --docker-options-build`
    );

    if (args.code === 1) {
      throw new InternalServerError(args.stderr);
    }

    return (
      args.stdout.match(
        /--build-arg [^\s]+=(.+?((?=\s*--build-arg)|(?=\s*$)))/gm
      ) ?? []
    );
  }

  async unsetBuildArg(appName: string, key: string) {
    const buildArg = (await this.buildArgs(appName)).find((it) =>
      RegExp(`^--build-arg ${key}=.*$`).test(it)
    );

    if (buildArg) {
      await execSSHCommand(
        `docker-options:remove ${appName} build '${buildArg}'`
      );
    }
  }

  async unsetEnvVar(
    appName: string,
    key: string,
    restart: boolean = true
  ): Promise<boolean> {
    await this.unsetBuildArg(appName, key);

    const resultUnsetEnv = await execSSHCommand(
      `config:unset ${restart ? '' : '--no-restart'} ${appName} ${key}`
    );

    if (resultUnsetEnv.code === 1) {
      throw new InternalServerError(resultUnsetEnv.stderr);
    }

    return true;
  }

  async rebuild(appName: string, options?: SSHExecOptions) {
    const resultAppRebuild = await execSSHCommand(
      `ps:rebuild ${appName}`,
      options
    );

    return resultAppRebuild;
  }

  async restart(appName: string, options?: SSHExecOptions) {
    const resultAppRestart = await execSSHCommand(
      `ps:restart ${appName}`,
      options
    );

    return resultAppRestart;
  }
}
