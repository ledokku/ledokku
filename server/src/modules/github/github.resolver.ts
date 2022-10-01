import { ResolverService } from '@tsed/typegraphql';
import { injectable } from 'tsyringe';
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { DokkuContext } from './../../models/dokku_context';
import { AppGithubMeta } from './data/models/app_meta_github.model';
import { Branch } from './data/models/branch.model';
import { Installation } from './data/models/installation.model';
import { Repository } from './data/models/repository.model';
import { GithubRepository } from './data/repositories/github.repository';

@injectable()
@Resolver(Repository)
@ResolverService(Repository)
export class GithubResolver {
  constructor(private ghRepository: GithubRepository) {}

  @Authorized()
  @Query((returns) => [Repository])
  async repositories(
    @Arg('installationId') installationId: string
  ): Promise<Repository[]> {
    return (await this.ghRepository.repositories(installationId)).repositories;
  }

  @Authorized()
  @Query((returns) => Installation)
  async githubInstallationId(
    @Ctx() context: DokkuContext
  ): Promise<Installation> {
    const user = await this.ghRepository.getUser(context.auth.userId);

    return (await this.ghRepository.installations(user.githubAccessToken))
      .installations[0];
  }

  @Authorized()
  @Query((returns) => AppGithubMeta, { nullable: true })
  async appMetaGithub(@Arg('appId') appId: string): Promise<AppGithubMeta> {
    return this.ghRepository.appMeta(appId);
  }

  @Authorized()
  @Query((returns) => [Branch])
  async branches(
    @Arg('repositoryName') repositoryName: string,
    @Arg('installationId') installationId: string,
    @Ctx() context: DokkuContext
  ): Promise<Branch[]> {
    const user = await this.ghRepository.getUser(context.auth.userId);

    return this.ghRepository.branches(
      user.username,
      repositoryName,
      installationId
    );
  }
}
