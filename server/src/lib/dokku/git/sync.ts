import { NodeSSH, SSHExecOptions } from 'node-ssh';

interface Args {
  ssh: NodeSSH;
  appName: string;
  gitRepoUrl: string;
  branchName: string;
  options: SSHExecOptions;
}

export const sync = async (args: Args) => {
  const resultGitSync = await args.ssh.execCommand(
    `git:sync --build ${args.appName} ${args.gitRepoUrl} ${args.branchName}`,
    args.options
  );
  return resultGitSync;
};
