import { ResolverService } from '@tsed/typegraphql';
import { Authorized, Ctx, Query, Resolver } from 'type-graphql';
import {
  DOKKU_SSH_HOST,
  GITHUB_APP_CLIENT_ID,
  IS_PRODUCTION,
  WEBHOOK_PROXY_URL,
} from './../../constants';
import { DokkuPluginRepository } from './../../lib/dokku/dokku.plugin.repository';
import { PluginList } from './../../lib/dokku/models/plugin_list.model';
import { DokkuContext } from './../../models/dokku_context';
import { GithubAppManifest } from './models/github_app_manifest.model';
import { GithubPermission } from './models/github_app_permissions.model';
import { SetupResult } from './models/setup_result.model';

@Resolver()
@ResolverService()
export class SystemResolver {
  constructor(private dokkuPluginRepository: DokkuPluginRepository) {}

  @Query((returns) => SetupResult)
  async setup(@Ctx() context: DokkuContext): Promise<SetupResult> {
    return {
      canConnectSsh: !!context.sshContext.connection,
      sshPublicKey: context.sshContext.publicKey,
      isGithubAppSetup: !!GITHUB_APP_CLIENT_ID,
      githubAppManifest: JSON.stringify(<GithubAppManifest>{
        name: 'Overclock Studios PaaS',
        url: IS_PRODUCTION
          ? `http://${DOKKU_SSH_HOST}`
          : 'http://localhost:3000',
        request_oauth_on_install: true,
        callback_url: IS_PRODUCTION
          ? `http://${DOKKU_SSH_HOST}`
          : 'http://localhost:3000',
        hook_attributes: {
          url: IS_PRODUCTION
            ? `http://${DOKKU_SSH_HOST}/github/api/webhooks`
            : WEBHOOK_PROXY_URL,
        },
        redirect_url: IS_PRODUCTION
          ? `http://${DOKKU_SSH_HOST}`
          : 'http://localhost:3000',
        public: false,
        default_permissions: {
          emails: GithubPermission.read,
          contents: GithubPermission.read,
          metadata: GithubPermission.read,
        },
        default_events: ['push'],
      }),
    };
  }

  @Authorized()
  @Query((returns) => PluginList)
  async dokkuPlugins(@Ctx() context: DokkuContext): Promise<PluginList> {
    return this.dokkuPluginRepository.list(context.sshContext.connection);
  }
}
