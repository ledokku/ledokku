import { ResolverService } from "@tsed/typegraphql";
import { Arg, Authorized, Ctx, Query } from "type-graphql";
import { DokkuContext } from "../../data/models/dokku_context";
import { UserRepository } from "./../../data/repositories/user_repository";
import { AppGithubMeta } from "./data/models/app_meta_github.model";
import { Branch } from "./data/models/branch.model";
import { Installation } from "./data/models/installation.model";
import { Repository } from "./data/models/repository.model";
import { GithubRepository } from "./data/repositories/github.repository";

@ResolverService(Repository)
export class GithubResolver {
  constructor(
    private ghRepository: GithubRepository,
    private userRepository: UserRepository
  ) {}

  @Authorized()
  @Query((returns) => [Repository])
  async repositories(
    @Arg("installationId") installationId: string
  ): Promise<Repository[]> {
    return (await this.ghRepository.repositories(installationId)).repositories;
  }

  @Authorized()
  @Query((returns) => Installation)
  async githubInstallationId(
    @Ctx() context: DokkuContext
  ): Promise<Installation> {
    const user = await this.userRepository.get(context.auth.user.id);

    return (await this.ghRepository.installations(user.githubAccessToken))
      .installations[0];
  }

  @Authorized()
  @Query((returns) => AppGithubMeta, { nullable: true })
  async appMetaGithub(@Arg("appId") appId: string): Promise<AppGithubMeta> {
    return this.ghRepository.appMeta(appId);
  }

  @Authorized()
  @Query((returns) => [Branch])
  async branches(
    @Arg("repositoryName") repositoryName: string,
    @Arg("installationId") installationId: string,
    @Ctx() context: DokkuContext
  ): Promise<Branch[]> {
    return this.ghRepository.branches(repositoryName, installationId);
  }
}
