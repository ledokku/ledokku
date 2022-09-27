import { Octokit } from '@octokit/rest';
import { PrismaClient, User } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { Unauthorized } from '@tsed/exceptions';
import fetch from 'node-fetch';
import { injectable } from 'tsyringe';
import { synchroniseServerQueue } from '../../../../queues/synchroniseServer';
import {
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CLIENT_SECRET,
  NUMBER_USERS_ALLOWED,
} from './../../../../constants';
import { GithubError } from './../models/github_error';
import { GithubOAuthLoginResponse } from './../models/github_oauth_login_response';

@Injectable()
@injectable()
export class GithubRepository {
  constructor(private prisma: PrismaClient) {}

  async loginOAuthApp(
    code: string
  ): Promise<GithubOAuthLoginResponse | GithubError> {
    return fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_APP_CLIENT_ID,
        client_secret: GITHUB_APP_CLIENT_SECRET,
        code,
        state: 'github_login',
      }),
    }).then((res) => res.json());
  }

  async getUserByAccessToken(access_token: string): Promise<User> {
    const octokit = new Octokit({
      auth: access_token,
    });

    const { data } = await octokit.users.getAuthenticated();

    return await this.prisma.user.findUnique({
      where: { githubId: data.node_id },
    });
  }

  async createUser(oauthData: GithubOAuthLoginResponse): Promise<User> {
    const userCount = await this.prisma.user.count();
    if (userCount >= NUMBER_USERS_ALLOWED) {
      throw new Unauthorized('Numero de usuarios excedido');
    }

    const octokit = new Octokit({
      auth: oauthData.access_token,
    });

    const { data: emails } = await octokit.users.listEmailsForAuthenticated();
    const { data: githubUser } = await octokit.users.getAuthenticated();

    const email = emails.find((email) => email.primary);

    const now = new Date();
    const time = now.getTime();
    const refreshTokenExpiresAt = new Date(
      time + (oauthData?.refresh_token_expires_in ?? 0)
    );

    return await this.prisma.user
      .create({
        data: {
          username: githubUser.login,
          avatarUrl: githubUser.avatar_url,
          email: email.email,
          githubAccessToken: oauthData.access_token,
          refreshToken: oauthData.refresh_token,
          refreshTokenExpiresAt,
          githubId: githubUser.node_id,
        },
      })
      .then(async (res) => {
        await synchroniseServerQueue.add('synchronise-server', {});
        return res;
      });
  }
}
