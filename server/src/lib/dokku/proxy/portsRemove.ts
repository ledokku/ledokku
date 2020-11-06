import { NodeSSH } from 'node-ssh';

export const proxyPortsRemove = async (
  ssh: NodeSSH,
  appName: string,
  scheme: string,
  host: string,
  container: string
) => {
  const resultProxyPorts = await ssh.execCommand(
    `proxy:ports-remove ${appName} ${scheme}:${host}:${container}`
  );

  if (resultProxyPorts.code === 1) {
    throw new Error(resultProxyPorts.stderr);
  }
};
