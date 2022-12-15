import { Injectable } from '@tsed/di';
import { InternalServerError } from '@tsed/exceptions';
import { execSSHCommand } from '../ssh';
import { ProxyPort } from './models/proxy_ports.model';

@Injectable()
export class DokkuProxyRepository {
  async add(
    appName: string,
    scheme: string,
    host: string,
    container: string
  ): Promise<boolean> {
    const resultProxyPorts = await execSSHCommand(
      `proxy:ports-add ${appName} ${scheme}:${host}:${container}`
    );

    if (resultProxyPorts.code === 1) {
      throw new InternalServerError(resultProxyPorts.stderr);
    }

    return true;
  }

  async remove(
    appName: string,
    scheme: string,
    host: string,
    container: string
  ): Promise<boolean> {
    const resultProxyPorts = await execSSHCommand(
      `proxy:ports-remove ${appName} ${scheme}:${host}:${container}`
    );

    if (resultProxyPorts.code === 1) {
      throw new InternalServerError(resultProxyPorts.stderr);
    }

    return true;
  }

  async ports(appName: string): Promise<ProxyPort[]> {
    const resultProxyPorts = await execSSHCommand(`proxy:ports ${appName}`);

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
