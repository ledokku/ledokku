import { BadRequest, InternalServerError } from '@tsed/exceptions';
import { execSSHCommand } from '../ssh';
import { PluginList } from './models/plugin_list.model';

export class DokkuPluginRepository {
  async install(pluginUrl: string): Promise<boolean> {
    if (!pluginUrl.endsWith('.git'))
      throw new BadRequest("La URL debe terminar con '.git'");

    const resultPluginInstall = await execSSHCommand(
      `plugin:install ${pluginUrl}`
    );

    if (resultPluginInstall.code === 1) {
      throw new InternalServerError(resultPluginInstall.stderr);
    }

    return true;
  }

  async installed(pluginName: string): Promise<boolean> {
    const resultPluginInstalled = await execSSHCommand(
      `plugin:installed ${pluginName}`
    );
    return resultPluginInstalled.code !== 1;
  }

  async list(): Promise<PluginList> {
    const resultPluginList = await execSSHCommand('plugin:list');

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
