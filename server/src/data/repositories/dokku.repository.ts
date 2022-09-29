import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH } from 'node-ssh';
import { injectable } from 'tsyringe';
import { ProxyPort } from '../models/proxy_ports.model';

@Injectable()
@injectable()
export class DokkuRepository {
  async appLogs(ssh: NodeSSH, appName: string): Promise<string[]> {
    const resultAppLogs = await ssh.execCommand(`logs ${appName}`);
    if (resultAppLogs.code === 1) {
      throw new InternalServerError(resultAppLogs.stderr);
    }

    return resultAppLogs.stdout.split('\n');
  }

  async proxyPorts(ssh: NodeSSH, appName: string): Promise<ProxyPort[]> {
    const resultProxyPorts = await ssh.execCommand(`proxy:ports ${appName}`);

    if (resultProxyPorts.code === 1) {
      throw new InternalServerError(resultProxyPorts.stderr);
    }

    const proxyPorts = resultProxyPorts.stdout
      .split('\n')
      .filter((line) => !line.includes('->'))
      .map<ProxyPort>((line) => {
        const data = line.split(' ').filter((line) => line !== '');
        return { scheme: data[0], host: data[1], container: data[2] };
      });

    return proxyPorts;
  }
}
