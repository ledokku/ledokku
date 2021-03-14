import { NodeSSH, SSHExecOptions } from 'node-ssh';

interface Args {
  ssh: NodeSSH;
  appName: string;
  gitBranchUrl: string;
  branchName: string;
  options: SSHExecOptions;
}

export const sync = async (args: Args) => {
  const resultGitSync = await args.ssh.execCommand(
    `git:sync --build ${args.appName} ${args.gitBranchUrl} ${args.branchName}`,
    args.options
  );
  return resultGitSync;
};
