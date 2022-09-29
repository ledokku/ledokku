import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH } from 'node-ssh';
import { injectable } from 'tsyringe';
import { EnvVar } from './models/env_var.model';

@Injectable()
@injectable()
export class DokkuAppRepository {
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

    return envVars.map((envVar) => {
      const split = envVar.split(': ');
      return {
        key: split[0],
        value: split[1].trim(),
      };
    });
  }
}
