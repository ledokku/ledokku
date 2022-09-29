import { NotFound } from '@tsed/exceptions';
import { ResolverService } from '@tsed/typegraphql';
import { injectable } from 'tsyringe';
import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { DokkuRepository } from '../../data/repositories/dokku.repository';
import { DokkuContext } from '../../models/dokku_context';
import { AppGithubMeta } from '../github/data/models/app_meta_github.model';
import { GithubRepository } from '../github/data/repositories/github.repository';
import { ProxyPort } from './../../data/models/proxy_ports.model';
import { App } from './data/models/app.model';
import { Logs } from './data/models/logs.model';
import { AppRepository } from './data/repositories/app.repository';

@Resolver(App)
@ResolverService(App)
@injectable()
export class AppResolver {
  constructor(
    private appRepository: AppRepository,
    private githubRepository: GithubRepository,
    private dokkuRepository: DokkuRepository
  ) {}

  @Authorized()
  @Query((returns) => App)
  async app(@Arg('appId') appId: string): Promise<App> {
    return this.appRepository.get(appId);
  }

  @Authorized()
  @Query((returns) => [App])
  async apps(): Promise<App[]> {
    return this.appRepository.getAll();
  }

  @Authorized()
  @Query((returns) => Logs)
  async appLogs(
    @Arg('appId') appId: string,
    @Ctx() context: DokkuContext
  ): Promise<Logs> {
    const app = await this.appRepository.get(appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${appId}`);
    }

    const logs = await this.dokkuRepository.appLogs(
      context.sshContext.connection,
      app.name
    );

    return { logs };
  }

  @Authorized()
  @Query((returns) => [ProxyPort])
  async appProxyPorts(
    @Arg('appId') appId: string,
    @Ctx() context: DokkuContext
  ): Promise<ProxyPort[]> {
    const app = await this.appRepository.get(appId);

    if (!app) {
      throw new Error(`No se encontró la app con ID ${appId}`);
    }

    return this.dokkuRepository.proxyPorts(
      context.sshContext.connection,
      app.name
    );
  }

  @Authorized()
  @FieldResolver((returns) => AppGithubMeta, { nullable: true })
  async appMetaGithub(@Root() app: App): Promise<AppGithubMeta> {
    return this.githubRepository.appMeta(app.id);
  }

  @Authorized()
  @FieldResolver((returns) => Logs)
  async logs(@Root() app: App, @Ctx() context: DokkuContext): Promise<Logs> {
    return this.appLogs(app.id, context);
  }
}
