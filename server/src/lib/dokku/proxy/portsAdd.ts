import { NodeSSH } from 'node-ssh';

export const proxyPortsAdd = async (
  ssh: NodeSSH,
  appName: string,
  scheme: string,
  host: string,
  container: string
) => {
  const resultProxyPorts = await ssh.execCommand(
    `proxy:ports-add ${appName} ${scheme}:${host}:${container}`
  );

  if (resultProxyPorts.code === 1) {
    throw new Error(resultProxyPorts.stderr);
  }

  console.log(resultProxyPorts.stdout);
};
