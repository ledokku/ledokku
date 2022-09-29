import { InternalServerError } from '@tsed/exceptions';
import { NodeSSH } from 'node-ssh';
import { PluginList } from './models/plugin_list.model';

export class DokkuPluginRepository {
  async list(ssh: NodeSSH): Promise<PluginList> {
    const resultPluginList = await ssh.execCommand('plugin:list');

    if (resultPluginList.code === 1) {
      throw new InternalServerError(resultPluginList.stderr);
    }

    const plugins = resultPluginList.stdout.split('\n');

    const pluginVersion = plugins[0].split(' ')[1];

    plugins.splice(0, 1);

    return {
      version: pluginVersion,
      plugins: plugins.map((plugin) => {
        const split = plugin.split(' ').filter((a) => a !== '');
        return {
          name: split[0],
          version: split[1],
        };
      }),
    };
  }
}
