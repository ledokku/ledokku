import { BadRequest, Conflict, NotFound } from '@tsed/exceptions';
import { ResolverService } from '@tsed/typegraphql';
import {
  Arg,
  Args,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Root,
  Subscription,
} from 'type-graphql';
import { PaginationArgs } from '../../data/args/pagination';
import { DokkuContext } from '../../data/models/dokku_context';
import { LogPayload } from '../../data/models/log_payload';
import { SubscriptionTopics } from '../../data/models/subscription_topics';
import { ProxyPort } from '../../lib/dokku/models/proxy_ports.model';
import { LinkDatabaseQueue } from '../../queues/link_database.queue';
import { RebuildAppQueue } from '../../queues/rebuild_app.queue';
import { RestartAppQueue } from '../../queues/restart_app.queue';
import { UnlinkDatabaseQueue } from '../../queues/unlink_database.queue';
import {
  AppRepository,
  DatabaseRepository,
  DokkuAppRepository,
  DokkuDomainsRepository,
  DokkuProxyRepository,
  GithubRepository,
  UserRepository,
} from '../../repositories';
import { Database } from '../databases/data/models/database.model';
import { AppGithubMeta } from '../github/data/models/app_meta_github.model';
import { SetEnvVarQueue } from './../../queues/set_env_var.queue';
import { UnsetEnvVarQueue } from './../../queues/unset_env_var.queue';
import { AddAppProxyPortInput } from './data/inputs/add_app_proxy_port.input';
import { AddDomainInput } from './data/inputs/add_domain.input';
import { CreateAppDokkuInput } from './data/inputs/create_app_dokku.input';
import { CreateAppGithubInput } from './data/inputs/create_app_github.input';
import { DestroyAppInput } from './data/inputs/destroy_app.input';
import { LinkDatabaseInput } from './data/inputs/link_database.input';
import { RebuildAppInput } from './data/inputs/rebuild_app.input';
import { RemoveAppProxyPortInput } from './data/inputs/remove_app_proxy_port.input';
import { RemoveDomainInput } from './data/inputs/remove_domain.input';
import { RestartAppInput } from './data/inputs/restart_app.input';
import { SetDomainInput } from './data/inputs/set_domain.input';
import { SetEnvVarInput } from './data/inputs/set_env_var.input';
import { UnlinkDatabaseInput } from './data/inputs/unlink_database.input';
import { UnsetEnvVarInput } from './data/inputs/unset_env_var.input';
import { App, AppPaginationInfo } from './data/models/app.model';
import { AppCreatedPayload } from './data/models/app_created.payload';
import { AppRebuildPayload } from './data/models/app_rebuild.payload';
import { AppRestartPayload } from './data/models/app_restart.payload';
import { CreateAppResult } from './data/models/create_app.model';
import { DomainList } from './data/models/domain_list.model';
import { EnvVarList } from './data/models/env_var_list.model';
import { Logs } from './data/models/logs.model';
import { BooleanResult } from './data/models/result.model';

@ResolverService(App)
export class AppResolver {
  constructor(
    private appRepository: AppRepository,
    private databaseRepository: DatabaseRepository,
    private githubRepository: GithubRepository,
    private dokkuAppRepository: DokkuAppRepository,
    private dokkuProxyRepository: DokkuProxyRepository,
    private dokkuDomainsRepository: DokkuDomainsRepository,
    private linkDatabaseQueue: LinkDatabaseQueue,
    private rebuildAppQueue: RebuildAppQueue,
    private setEnvVarQueue: SetEnvVarQueue,
    private unlinkDatabaseQueue: UnlinkDatabaseQueue,
    private unsetEnvVarQueue: UnsetEnvVarQueue,
    private restartAppQueue: RestartAppQueue,
    private userRepository: UserRepository
  ) {}

  @Authorized()
  @Query((returns) => App)
  async app(@Arg('appId') appId: string): Promise<App> {
    return this.appRepository.get(appId);
  }

  @Authorized()
  @Query((returns) => AppPaginationInfo)
  async apps(
    @Args((type) => PaginationArgs) pagination: PaginationArgs
  ): Promise<AppPaginationInfo> {
    return this.appRepository.getAllPaginated(pagination);
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
  @Query((returns) => DomainList)
  async domains(
    @Arg('appId') appId: string,
    @Ctx() context: DokkuContext
  ): Promise<DomainList> {
    const app = await this.appRepository.get(appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${appId}`);
    }

    const domains = await this.dokkuDomainsRepository.report(
      context.sshContext.connection,
      app.name
    );

    return { domains };
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
  @Mutation((returns) => BooleanResult)
  async setEnvVar(
    @Arg('input', (type) => SetEnvVarInput) input: SetEnvVarInput
  ): Promise<BooleanResult> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.setEnvVarQueue.add({
      appName: app.name,
      ...input,
    });

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async unsetEnvVar(
    @Arg('input', (type) => UnsetEnvVarInput) input: UnsetEnvVarInput
  ): Promise<BooleanResult> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.unsetEnvVarQueue.add({
      appName: app.name,
      key: input.key,
    });

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async addAppProxyPort(
    @Arg('input', (type) => AddAppProxyPortInput) input: AddAppProxyPortInput,
    @Ctx() context: DokkuContext
  ): Promise<Boolean> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.dokkuProxyRepository.add(
      context.sshContext.connection,
      app.name,
      'http',
      input.host,
      input.container
    );

    return true;
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async addDomain(
    @Arg('input', (type) => AddDomainInput) input: AddDomainInput,
    @Ctx() context: DokkuContext
  ): Promise<BooleanResult> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.dokkuDomainsRepository.add(
      context.sshContext.connection,
      app.name,
      input.domainName
    );

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => CreateAppResult)
  async createAppDokku(
    @Arg('input', (type) => CreateAppDokkuInput) input: CreateAppDokkuInput,
    @Ctx() context: DokkuContext
  ): Promise<CreateAppResult> {
    if (!/^[a-z0-9-]+$/.test(input.name))
      throw new BadRequest('Mal formato del nombre');

    const appNameExists = await this.appRepository.exists(input.name);

    if (appNameExists) {
      throw new Conflict('Nombre ya utilizado');
    }

    await this.dokkuAppRepository.create(
      context.sshContext.connection,
      input.name
    );

    const app = await this.appRepository.create(input.name);

    // const appBuild = await this.appBuildRepository.updateStatus(
    //   app.id,
    //   AppBuildStatus.PENDING
    // );

    // this.buildAppQueue.add({
    //   buildId: appBuild.id,
    // });

    return { appId: app.id };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async createAppGithub(
    @Arg('input', (type) => CreateAppGithubInput) input: CreateAppGithubInput,
    @Ctx() context: DokkuContext,
    @PubSub() pubSub: PubSubEngine
  ): Promise<BooleanResult> {
    if (!/^[a-z0-9-]+$/.test(input.name))
      throw new BadRequest('Mal formato del nombre');

    const user = await this.userRepository.get(context.auth.user.id);
    const appNameExists = await this.appRepository.exists(input.name);

    if (appNameExists) {
      throw new Conflict('Nombre ya utilizado');
    }

    const repo = await this.githubRepository.repository(
      input.githubInstallationId,
      input.gitRepoFullName
    );

    if (!repo) {
      throw new NotFound(
        `No se encontró el repositorio ${input.gitRepoFullName}`
      );
    }

    const branch = await this.githubRepository.branch(
      input.githubInstallationId,
      input.gitRepoFullName,
      input.branchName
    );

    if (!branch) {
      throw new NotFound(`La rama ${input.branchName} no existe`);
    }

    const created = await this.dokkuAppRepository.create(
      context.sshContext.connection,
      input.name
    );

    if (created) {
      const app = await this.githubRepository.createApp(
        input.githubInstallationId,
        input.name,
        input.gitRepoFullName,
        input.gitRepoId,
        user,
        input.branchName
      );
    }

    // TODO enable again once we start the github app autodeployment
    // const appBuild = await prisma.appBuild.create({
    //   data: {
    //     status: 'PENDING',
    //     user: {
    //       connect: {
    //         id: userId,
    //       },
    //     },
    //     app: {
    //       connect: {
    //         id: app.id,
    //       },
    //     },
    //   },
    // });

    // // We trigger the queue that will add dokku to the server
    // await buildAppQueue.add('build-app', { buildId: appBuild.id });

    return { result: created };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async destroyApp(
    @Arg('input', (type) => DestroyAppInput) input: DestroyAppInput,
    @Ctx() context: DokkuContext
  ): Promise<BooleanResult> {
    const appToDelete = await this.appRepository.get(input.appId);

    if (!appToDelete) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    // TODO enable again once we start the github app autodeployment
    // We find and delete all the related app builds
    // const allAppBuilds = await prisma.user
    //   .findUnique({
    //     where: {
    //       id: userId,
    //     },
    //   })
    //   .AppBuild();

    // const appBuildToDelete = allAppBuilds.filter(
    //   (appBuild) => appBuild.appId === appToDelete.id
    // );

    // await prisma.appBuild.delete({
    //   where: {
    //     id: appBuildToDelete[0].id,
    //   },
    // });

    await this.appRepository.delete(appToDelete.id);

    const result = await this.dokkuAppRepository.destroy(
      context.sshContext.connection,
      appToDelete.name
    );

    return { result };
  }

  @Authorized()
  @Mutation((returns) => Boolean)
  async removeAppProxyPort(
    @Arg('input', (type) => RemoveAppProxyPortInput)
    input: RemoveAppProxyPortInput,
    @Ctx() context: DokkuContext
  ) {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.dokkuProxyRepository.remove(
      context.sshContext.connection,
      app.name,
      input.scheme,
      input.host,
      input.container
    );

    return true;
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async removeDomain(
    @Arg('input', (type) => RemoveDomainInput)
    input: RemoveDomainInput,
    @Ctx() context: DokkuContext
  ): Promise<BooleanResult> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.dokkuDomainsRepository.remove(
      context.sshContext.connection,
      app.name,
      input.domainName
    );

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async setDomain(
    @Arg('input', (type) => SetDomainInput)
    input: SetDomainInput,
    @Ctx() context: DokkuContext
  ): Promise<BooleanResult> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.dokkuDomainsRepository.set(
      context.sshContext.connection,
      app.name,
      input.domainName
    );

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async linkDatabase(
    @Arg('input', (type) => LinkDatabaseInput)
    input: LinkDatabaseInput
  ) {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    const database = await this.databaseRepository.databaseWithApps(
      input.databaseId,
      input.appId
    );

    if (!database) {
      throw new NotFound(
        `La base de datos no existe con ID ${input.databaseId}`
      );
    }

    const isLinked = database.apps.length === 1;

    if (isLinked) {
      throw new Error(
        `${database.name} database is already linked to ${app.name} app`
      );
    }

    await this.linkDatabaseQueue.add({
      ...input,
    });

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async unlinkDatabase(
    @Arg('input', (type) => UnlinkDatabaseInput)
    input: UnlinkDatabaseInput
  ): Promise<BooleanResult> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    const database = await this.databaseRepository.databaseWithApps(
      input.databaseId,
      input.appId
    );

    if (!database) {
      throw new NotFound(
        `La base de datos no existe con ID ${input.databaseId}`
      );
    }

    const isLinked = database.apps.length === 1;

    if (!isLinked) {
      throw new NotFound(
        `La base de datos ${database.name} no esta vinculada a ${app.name}`
      );
    }

    await this.unlinkDatabaseQueue.add({
      ...input,
    });

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async rebuildApp(
    @Arg('input', (type) => RebuildAppInput)
    input: RebuildAppInput
  ) {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.rebuildAppQueue.add({
      appName: app.name,
    });

    return { result: true };
  }

  @Authorized()
  @Mutation((returns) => BooleanResult)
  async restartApp(
    @Arg('input', (type) => RestartAppInput)
    input: RestartAppInput
  ): Promise<BooleanResult> {
    const app = await this.appRepository.get(input.appId);

    if (!app) {
      throw new NotFound(`No se encontró la app con ID ${input.appId}`);
    }

    await this.restartAppQueue.add({
      appName: app.name,
    });

    return { result: true };
  }

  @Authorized()
  @Subscription((type) => LogPayload, {
    topics: SubscriptionTopics.APP_CREATED,
  })
  appCreateLogs(@Root() payload: AppCreatedPayload): LogPayload {
    return payload.appCreateLogs;
  }

  @Authorized()
  @Subscription((type) => LogPayload, {
    topics: SubscriptionTopics.APP_RESTARTED,
  })
  appRestartLogs(@Root() payload: AppRestartPayload): LogPayload {
    return payload.appRestartLogs;
  }

  @Authorized()
  @Subscription((type) => LogPayload, {
    topics: SubscriptionTopics.APP_REBUILT,
  })
  appRebuildLogs(@Root() payload: AppRebuildPayload): LogPayload {
    return payload.appRebuildLogs;
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

  @Authorized()
  @FieldResolver((returns) => [ProxyPort])
  async ports(
    @Root() app: App,
    @Ctx() context: DokkuContext
  ): Promise<ProxyPort[]> {
    try {
      return await this.dokkuProxyRepository.ports(
        context.sshContext.connection,
        app.name
      );
    } catch (e) {
      return [];
    }
  }
}
