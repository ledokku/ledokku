import { $log } from "@tsed/common";
import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/rest";
import { App, AppMetaGithub, PrismaClient, Roles, User } from "@prisma/client";
import { Injectable } from "@tsed/di";
import { Unauthorized } from "@tsed/exceptions";
import fetch from "node-fetch";
import { DeployAppQueue } from "../../../../queues/deploy_app.queue";
import { SettingsRepository } from "../../../../repositories";
import { formatGithubPem } from "./../../../../config";
import {
  GITHUB_APP_CLIENT_ID,
  GITHUB_APP_CLIENT_SECRET,
  GITHUB_APP_ID,
  GITHUB_APP_PEM,
} from "./../../../../constants";
import { SyncServerQueue } from "./../../../../queues/sync_server.queue";
import { GithubError } from "./../models/github_error";
import { GithubOAuthLoginResponse } from "./../models/github_oauth_login_response";

@Injectable()
export class GithubRepository {
  constructor(
    private prisma: PrismaClient,
    private deployAppQueue: DeployAppQueue,
    private syncServerQueue: SyncServerQueue,
    private settingsRepository: SettingsRepository
  ) {}

  private installationAuth = createAppAuth({
    appId: GITHUB_APP_ID,
    privateKey: formatGithubPem(GITHUB_APP_PEM),
    clientId: GITHUB_APP_CLIENT_ID,
    clientSecret: GITHUB_APP_CLIENT_SECRET,
  });

  async createApp(
    installationId: string,
    appName: string,
    repoFullName: string,
    repoId: string,
    user: User,
    branch?: string,
    tags?: string[]
  ): Promise<App> {
    const installationAuthentication = await this.installationAuth({
      type: "installation",
      installationId,
    });

    const fullName = repoFullName.split("/");

    const repoData = {
      owner: fullName[0],
      repoName: fullName[1],
    };

    return this.prisma.app
      .create({
        data: {
          userId: user.id,
          name: appName,
          type: "GITHUB",
          tags: {
            connectOrCreate: tags?.map((it) => ({
              where: {
                name: it,
              },
              create: {
                name: it,
              },
            })),
          },
          AppMetaGithub: {
            create: {
              repoName: repoData.repoName,
              repoOwner: repoData.owner,
              repoId,
              githubAppInstallationId: installationId,
              branch: branch ? branch : "main",
            },
          },
        },
        include: {
          AppMetaGithub: true,
        },
      })
      .then(async (res) => {
        await this.deployAppQueue.add({
          appId: res.id,
          userName: user.username,
          token: installationAuthentication.token,
          deleteOnFailed: false,
        });

        return res;
      });
  }

  async repository(installationId: string, repoFullName: string) {
    const installationAuthentication = await this.installationAuth({
      type: "installation",
      installationId,
    });

    const octo = new Octokit({
      auth: installationAuthentication.token,
    });

    const fullName = repoFullName.split("/");

    const repoData = {
      owner: fullName[0],
      repoName: fullName[1],
    };

    return octo.repos
      .get({
        owner: repoData.owner,
        repo: repoData.repoName,
      })
      .then((res) => res.data);
  }

  async branch(installationId: string, repoFullName: string, branch: string) {
    const installationAuthentication = await this.installationAuth({
      type: "installation",
      installationId,
    });

    const octo = new Octokit({
      auth: installationAuthentication.token,
    });

    const fullName = repoFullName.split("/");

    const repoData = {
      owner: fullName[0],
      repoName: fullName[1],
    };

    return octo.repos
      .getBranch({
        owner: repoData.owner,
        repo: repoData.repoName,
        branch: branch,
      })
      .then((res) => res.data);
  }

  async repositories(installationId: string, per_page = 30, page = 1) {
    $log.info(installationId);

    const installationAuthentication = await this.installationAuth({
      type: "installation",
      installationId,
    });

    $log.info(installationAuthentication.token, installationAuthentication);

    const octo = new Octokit({
      auth: installationAuthentication.token,
    });

    return octo
      .request("GET /installation/repositories", {
        per_page,
        page,
      })
      .then((res) => res.data);
  }

  async installations(token: string, per_page = 30, page = 1) {
    const octo = new Octokit({
      auth: token,
    });

    return octo
      .request("GET /user/installations", {
        per_page,
        page,
      })
      .then((res) => res.data);
  }

  async loginOAuthApp(
    code: string
  ): Promise<GithubOAuthLoginResponse | GithubError> {
    return fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_APP_CLIENT_ID,
        client_secret: GITHUB_APP_CLIENT_SECRET,
        code,
        state: "github_login",
      }),
    }).then<GithubOAuthLoginResponse | GithubError>((res) => res.json() as any);
  }

  async getGithubUser(access_token: string) {
    const octokit = new Octokit({
      auth: access_token,
    });

    const { data } = await octokit.users.getAuthenticated();

    return data;
  }

  async getUserByAccessToken(access_token: string): Promise<User> {
    const data = await this.getGithubUser(access_token);

    return await this.prisma.user.findUnique({
      where: { githubId: data.node_id },
    });
  }

  async getUserEmails(access_token: string) {
    const octokit = new Octokit({
      auth: access_token,
    });

    const { data: emails } =
      await octokit.users.listEmailsForAuthenticatedUser();

    return emails;
  }

  async getPrimaryEmail(access_token: string) {
    const emails = await this.getUserEmails(access_token);

    return emails.find((email) => email.primary);
  }

  async createUser(oauthData: GithubOAuthLoginResponse): Promise<User> {
    const settings = await this.settingsRepository.get();
    const userCount = await this.prisma.user.count();

    const octokit = new Octokit({
      auth: oauthData.access_token,
    });

    const { data: githubUser } = await octokit.users.getAuthenticated();
    const email = await this.getPrimaryEmail(oauthData.access_token);

    if (
      settings.allowedEmails.length > 0 &&
      !settings.allowedEmails.includes(email.email)
    ) {
      throw new Unauthorized("Este correo electrónico no esta permitido");
    }

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
          role: userCount === 0 ? Roles.OWNER : Roles.ADMIN,
        },
      })
      .then(async (res) => {
        await this.syncServerQueue.add();
        return res;
      });
  }

  async appMeta(id: string): Promise<AppMetaGithub> {
    return this.prisma.app
      .findUnique({
        where: { id },
      })
      .AppMetaGithub();
  }

  async branches(
    repoFullName: string,
    installationId: string
  ) {
    const installationAuthentication = await this.installationAuth({
      type: "installation",
      installationId,
    });

    const octo = new Octokit({
      auth: installationAuthentication.token,
    });

    return (await octo.request(`GET /repos/${repoFullName}/branches`)).data;
  }

  async deployRepository(
    installationId: string,
    repositoryId: string,
    branchName: string,
    userName: string,
    deleteOnFailed?: boolean
  ) {
    const installationAuthentication = await this.installationAuth({
      type: "installation",
      installationId,
    });

    const appsToRedeploy = await this.prisma.appMetaGithub.findMany({
      where: {
        repoId: repositoryId,
        branch: branchName,
      },
    });

    for (const app of appsToRedeploy) {
      const appToRedeploy = await this.prisma.app.findUnique({
        where: {
          id: app.appId,
        },
      });

      await this.deployAppQueue.add({
        appId: appToRedeploy.id,
        userName: userName,
        token: installationAuthentication.token,
        deleteOnFailed,
      });
    }
  }
}
