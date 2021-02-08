import { NodeSSH, SSHExecOptions } from 'node-ssh';

export const sync = async (
  ssh: NodeSSH,
  appName: string,
  gitBranchUrl: string,
  branchName?: string,
  options?: SSHExecOptions
) => {
  const resultGitSync = await ssh.execCommand(
    `git:sync --build ${appName} ${gitBranchUrl} ${branchName}`,
    options
  );
  return resultGitSync;
};
