import { NodeSSH } from 'node-ssh';

const parseDomainsCommand = (commandResult: string) => {
  const domains = commandResult.split(' ');
  return domains;
};

export const report = async (ssh: NodeSSH, name: string) => {
  const resultReportDomains = await ssh.execCommand(
    `domains:report ${name} --domains-app-vhosts`
  );

  if (resultReportDomains.code === 1) {
    throw new Error(resultReportDomains.stderr);
  }

  return parseDomainsCommand(resultReportDomains.stdout);
};
