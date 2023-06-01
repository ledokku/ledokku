import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { execSSHCommand } from '../ssh';

@Injectable()
export class DokkuDomainsRepository {
  async add(appName: string, domainName: string): Promise<boolean> {
    const resultAddDomain = await execSSHCommand(
      `domains:add ${appName} ${domainName}`
    );

    await execSSHCommand(`letsencrypt:enable ${appName}`);
    await execSSHCommand(`proxy:build-config ${appName}`);

    if (resultAddDomain.code === 1) {
      throw new InternalServerError(resultAddDomain.stderr);
    }

    return true;
  }

  async remove(appName: string, domainName: string): Promise<boolean> {
    const resultRemoveDomain = await execSSHCommand(
      `domains:remove ${appName} ${domainName}`
    );

    if (resultRemoveDomain.code === 1) {
      throw new InternalServerError(resultRemoveDomain.stderr);
    }

    return true;
  }

  async set(appName: string, domainName: string): Promise<boolean> {
    const resultSetDomain = await execSSHCommand(
      `domains:set ${appName} ${domainName}`
    );

    if (resultSetDomain.code === 1) {
      throw new InternalServerError(resultSetDomain.stderr);
    }

    return true;
  }

  async report(appName: string): Promise<string[]> {
    const resultReportDomains = await execSSHCommand(
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
