import { $log } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import { ResolverService } from '@tsed/typegraphql';
import jsonwebtoken from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { UserRepository } from '../../repositories';
import { GithubRepository } from '../github/data/repositories/github.repository';
import { JWT_SECRET } from './../../constants';
import { Auth } from './data/models/auth.model';

@ResolverService(Auth)
export class AuthResolver {
  constructor(
    private githubRepository: GithubRepository,
    private userRepository: UserRepository
  ) {}

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
    } else {
      const now = new Date();
      const time = now.getTime();
      const refreshTokenExpiresAt = new Date(
        time + (data?.refresh_token_expires_in ?? 0)
      );

      user = await this.userRepository.update(user.id, {
        refreshToken: data.refresh_token,
        refreshTokenExpiresAt: refreshTokenExpiresAt,
        githubAccessToken: data.access_token,
      });
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
