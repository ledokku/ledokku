import { ResolverService } from '@tsed/typegraphql';
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { DokkuPluginRepository } from '../../lib/dokku/dokku.plugin.repository';
import { DokkuContext } from '../../data/models/dokku_context';
import { Repository } from '../github/data/models/repository.model';
import { IsPluginInstalled } from './models/is_plugin_instaled.model';

@ResolverService(Repository)
export class PluginResolver {
  constructor(private dokkuPluginRepository: DokkuPluginRepository) {}

  @Authorized()
  @Query((returns) => IsPluginInstalled)
  async isPluginInstalled(
    @Arg('pluginName', (type) => String) pluginName: string,
    @Ctx() context: DokkuContext
  ): Promise<IsPluginInstalled> {
    const dokkuPlugins = await this.dokkuPluginRepository.list(
      context.sshContext.connection
    );

    const isPluginInstalled = !!dokkuPlugins.plugins.find(
      (plugin) => plugin.name === pluginName
    );

    return { isPluginInstalled };
  }
}
