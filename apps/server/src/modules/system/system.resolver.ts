import { $log } from '@tsed/common';
import { ResolverService } from '@tsed/typegraphql';
import { Authorized, Ctx, Query, Root, Subscription } from 'type-graphql';
import { ledokkuLogs } from '../../config/appender';
import { DokkuContext } from '../../data/models/dokku_context';
import { LogPayload } from '../../data/models/log_payload';
import { SubscriptionTopics } from '../../data/models/subscription_topics';
import { sshConnect } from '../../lib/ssh';
import {
  DOKKU_SSH_HOST,
  GITHUB_APP_CLIENT_ID,
  IS_PRODUCTION,
  WEBHOOK_PROXY_URL,
} from './../../constants';
import { DokkuPluginRepository } from './../../lib/dokku/dokku.plugin.repository';
import { PluginList } from './../../lib/dokku/models/plugin_list.model';
import { GithubAppManifest } from './models/github_app_manifest.model';
import { GithubPermission } from './models/github_app_permissions.model';
import { LedokkuLogsPayload } from './models/ledokku_logs_payload.model';
import { SetupResult } from './models/setup_result.model';

@ResolverService()
export class SystemResolver {
  constructor(private dokkuPluginRepository: DokkuPluginRepository) {}

  @Query((returns) => SetupResult)
  async setup(@Ctx() context: DokkuContext): Promise<SetupResult> {
    const ssh = await sshConnect().catch((e) => {
      $log.info(e);
      return undefined;
    });
    return {
      canConnectSsh: ssh?.isConnected() === true,
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
  @Subscription((type) => LogPayload, {
    topics: SubscriptionTopics.LEDOKKU_LOGS,
  })
  onLedokkuLog(@Root() payload: LedokkuLogsPayload): LogPayload {
    return payload.ledokkuLogs;
  }

  @Authorized()
  @Query((returns) => [LogPayload])
  async ledokkuLogs(@Ctx() context: DokkuContext): Promise<LogPayload[]> {
    return ledokkuLogs;
  }

  @Authorized()
  @Query((returns) => PluginList)
  async dokkuPlugins(@Ctx() context: DokkuContext): Promise<PluginList> {
    return this.dokkuPluginRepository.list();
  }
}
