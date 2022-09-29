import { ResolverService } from '@tsed/typegraphql';
import { Arg, Authorized, Ctx, Query, Resolver } from 'type-graphql';
import { DokkuContext } from './../../models/dokku_context';
import { AppGithubMeta } from './data/models/app_meta_github.model';
import { Branch } from './data/models/branch.model';
import { GithubRepository } from './data/repositories/github.repository';

@Resolver(AppGithubMeta)
@ResolverService(AppGithubMeta)
export class GithubMetaResolver {
  constructor(private ghRepository: GithubRepository) {}

  @Authorized()
  @Query((returns) => AppGithubMeta, { nullable: true })
  async appMetaGithub(@Arg('appId') appId: string): Promise<AppGithubMeta> {
    return this.ghRepository.appMeta(appId);
  }

  @Authorized()
  @Query((returns) => [Branch])
  async branches(
    repositoryName: string,
    installationId: string,
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
