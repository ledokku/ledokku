import { $log } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import { ResolverService } from '@tsed/typegraphql';
import jsonwebtoken from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { GithubRepository } from '../github/data/repositories/github.repository';
import { JWT_SECRET } from './../../constants';
import { Auth } from './data/models/auth.model';

@ResolverService(Auth)
export class AuthResolver {
  constructor(private githubRepository: GithubRepository) {}

  @Mutation((returns) => Auth)
  async loginWithGithub(
    @Arg('code', (type) => String) code: string
  ): Promise<Auth> {
    let data = await this.githubRepository.loginOAuthApp(code).catch((e) => {
      throw new InternalServerError(e);
    });

    if ('error' in data) {
      $log.error(data);
      throw new InternalServerError(data.error_description);
    }

    let user = await this.githubRepository.getUserByAccessToken(
      data.access_token
    );

    if (!user) {
      user = await this.githubRepository.createUser(data);
    }

    const jwtToken = jsonwebtoken.sign(
      {
        userId: user.id,
        avatarUrl: user.avatarUrl,
        userName: user.username,
      },
      JWT_SECRET,
      {
        expiresIn: '365d',
      }
    );

    return { token: jwtToken };
  }
}
