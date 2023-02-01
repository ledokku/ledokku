import { Roles } from '@prisma/client';
import { $log } from '@tsed/common';
import { Forbidden, InternalServerError } from '@tsed/exceptions';
import { ResolverService } from '@tsed/typegraphql';
import jsonwebtoken from 'jsonwebtoken';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { SettingsRepository, UserRepository } from '../../repositories';
import { GithubRepository } from '../github/data/repositories/github.repository';
import { JWT_SECRET } from './../../constants';
import { Auth } from './data/models/auth.model';

@ResolverService(Auth)
export class AuthResolver {
  constructor(
    private githubRepository: GithubRepository,
    private userRepository: UserRepository,
    private settingsRepository: SettingsRepository
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

    const ghUser = await this.githubRepository.getGithubUser(data.access_token);
    const email = await this.githubRepository.getPrimaryEmail(
      data.access_token
    );

    const settings = await this.settingsRepository.get();

    let user = await this.userRepository.getByGithubId(ghUser.node_id);

    if (
      settings.allowedEmails.length > 0 &&
      !settings.allowedEmails.includes(email.email) &&
      user.role !== Roles.OWNER
    ) {
      throw new Forbidden('Usuario no permitido');
    }

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
