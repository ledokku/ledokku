import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH, SSHExecOptions } from 'node-ssh';
import { execSSHCommand } from '../ssh';

@Injectable()
export class DokkuGitRepository {
  async auth(
    username: string,
    token: string,
    options?: SSHExecOptions
  ): Promise<boolean> {
    const resultGitAuth = await execSSHCommand(
      `git:auth github.com ${username} ${token}`,
      options
    );

    if (resultGitAuth.code === 1) {
      throw new InternalServerError(resultGitAuth.stderr);
    }

    return true;
  }

  async sync(
    appName: string,
    gitRepoUrl: string,
    branchName: string,
    options: SSHExecOptions
  ) {
    const resultGitSync = await execSSHCommand(
      `git:sync --build ${appName} ${gitRepoUrl} ${branchName}`,
      options
    );

    if (resultGitSync.code === 1) {
      throw new InternalServerError(resultGitSync.stderr);
    }

    return resultGitSync;
  }

  async unlock(appName: string, options?: SSHExecOptions) {
    const resultGitUnlock = await execSSHCommand(
      `git:unlock ${appName} --force`,
      options
    );

    if (resultGitUnlock.code === 1) {
      throw new InternalServerError(resultGitUnlock.stderr);
    }

    return resultGitUnlock;
  }
}
