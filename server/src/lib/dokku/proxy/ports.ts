import { NodeSSH } from 'node-ssh';

export const proxyPorts = async (ssh: NodeSSH, appName: string) => {
  const resultProxyPorts = await ssh.execCommand(`proxy:ports ${appName}`);

  if (resultProxyPorts.code === 1) {
    throw new Error(resultProxyPorts.stderr);
  }

  // Cleanup the output
  const proxyPorts = resultProxyPorts.stdout
    .split('\n')
    // Remove all the lines containing ->
    .filter((line) => !line.includes('->'))
    .map((line) => {
      const data = line.split(' ').filter((line) => line !== '');
      return { scheme: data[0], host: data[1], container: data[2] };
    });

  return proxyPorts;
};
