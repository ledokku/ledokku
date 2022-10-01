import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH } from 'node-ssh';

@Injectable()
export class DokkuDomainsRepository {
  async add(
    ssh: NodeSSH,
    appName: string,
    domainName: string
  ): Promise<boolean> {
    const resultAddDomain = await ssh.execCommand(
      `domains:add ${appName} ${domainName}`
    );

    if (resultAddDomain.code === 1) {
      throw new InternalServerError(resultAddDomain.stderr);
    }

    return true;
  }

  async remove(
    ssh: NodeSSH,
    appName: string,
    domainName: string
  ): Promise<boolean> {
    const resultRemoveDomain = await ssh.execCommand(
      `domains:remove ${appName} ${domainName}`
    );

    if (resultRemoveDomain.code === 1) {
      throw new InternalServerError(resultRemoveDomain.stderr);
    }

    return true;
  }

  async set(
    ssh: NodeSSH,
    appName: string,
    domainName: string
  ): Promise<boolean> {
    const resultSetDomain = await ssh.execCommand(
      `domains:set ${appName} ${domainName}`
    );

    if (resultSetDomain.code === 1) {
      throw new InternalServerError(resultSetDomain.stderr);
    }

    return true;
  }

  async report(ssh: NodeSSH, appName: string): Promise<string[]> {
    const resultReportDomains = await ssh.execCommand(
      `domains:report ${appName} --domains-app-vhosts`
    );

    if (resultReportDomains.code === 1) {
      throw new InternalServerError(resultReportDomains.stderr);
    }

    if (resultReportDomains.stdout === '') {
      return [];
    }

    const domains = resultReportDomains.stdout.split(' ');
    return domains;
  }
}
