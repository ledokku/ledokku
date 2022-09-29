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
import { DokkuAppRepository } from '../../lib/dokku/dokku.app.repository';
import { DokkuProxyRepository } from '../../lib/dokku/dokku.proxy.repository';
import { ProxyPort } from '../../lib/dokku/models/proxy_ports.model';
import { DokkuContext } from '../../models/dokku_context';
import { Database } from '../databases/data/models/database.model';
import { AppGithubMeta } from '../github/data/models/app_meta_github.model';
import { GithubRepository } from '../github/data/repositories/github.repository';
import { App } from './data/models/app.model';
import { EnvVarList } from './data/models/env_var_list.model';
import { Logs } from './data/models/logs.model';
import { AppRepository } from './data/repositories/app.repository';

@Resolver(App)
@ResolverService(App)
@injectable()
export class AppResolver {
  constructor(
    private appRepository: AppRepository,
    private githubRepository: GithubRepository,
    private dokkuAppRepository: DokkuAppRepository,
    private dokkuProxyRepository: DokkuProxyRepository
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

    const logs = await this.dokkuAppRepository.logs(
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
      throw new NotFound(`No se encontró la app con ID ${appId}`);
    }

    return this.dokkuProxyRepository.ports(
      context.sshContext.connection,
      app.name
    );
  }

  @Authorized()
  @Query((returns) => EnvVarList)
  async envVars(
    @Arg('appId') appId: string,
    @Ctx() context: DokkuContext
  ): Promise<EnvVarList> {
    const app = await this.appRepository.get(appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${appId}`);
    }

    const envVars = await this.dokkuAppRepository.envVars(
      context.sshContext.connection,
      app.name
    );

    return { envVars };
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

  @Authorized()
  @FieldResolver((returns) => [Database])
  async databases(@Root() app: App): Promise<Database[]> {
    return this.appRepository.databases(app.id);
  }
}
