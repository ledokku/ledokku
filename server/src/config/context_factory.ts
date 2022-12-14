import { PrismaClient, User } from '@prisma/client';
import { $log, InjectorService } from '@tsed/common';
import express from 'express';
import { readFile } from 'fs/promises';
import jsonwebtoken from 'jsonwebtoken';
import { sshKeyPath } from '../config';
import { DokkuContext } from '../data/models/dokku_context';
import { sshConnect } from '../lib/ssh';
import {
  GITHUB_APP_CLIENT_ID,
  JWT_SECRET,
  GITHUB_APP_CLIENT_SECRET,
} from './../constants';
import fetch from 'node-fetch';
import prisma from '../lib/prisma';

export class ContextFactory {
  static async generateBaseContext(): Promise<Partial<DokkuContext>> {
    const injector = new InjectorService();
    await injector.loadAsync();

    let sshConnection = undefined;
    const publicKey = await readFile(`${sshKeyPath}.pub`, {
      encoding: 'utf8',
    });

    try {
      sshConnection = await sshConnect();
    } catch (e) {
      $log.warn(e);
    }

    return {
      prisma: prisma,
      sshContext: {
        publicKey,
        connection: sshConnection,
      },
    };
  }

  static async createFromHTTP(req?: express.Request): Promise<DokkuContext> {
    const token =
      req?.headers?.['authorization'] &&
      (req.headers['authorization'] as string).replace('Bearer ', '');

    const baseContext = await ContextFactory.generateBaseContext();

    const user = await this.decodeJWT(token);

    return <DokkuContext>{
      ...baseContext,
      auth: user
        ? {
            token,
            user,
          }
        : undefined,
    };
  }

  static async createFromWS(connectionParams?: any): Promise<DokkuContext> {
    const baseContext = await ContextFactory.generateBaseContext();

    const user = await this.decodeJWT(connectionParams?.token);

    return <DokkuContext>{
      ...baseContext,
      auth: user
        ? {
            token: connectionParams.token,
            user,
          }
        : undefined,
    };
  }

  private static async decodeJWT(token: string): Promise<User> {
    try {
      const decoded = jsonwebtoken.verify(token, JWT_SECRET) as {
        userId: string;
      };

      return this.getUserAndRefreshIfNeeded(decoded.userId);
    } catch (e) {}

    return undefined;
  }

  private static async getUserAndRefreshIfNeeded(userId: string) {
    console.log(prisma);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user.refreshTokenExpiresAt < new Date()) {
      const res: {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        refresh_token_expires_in: string;
        scope: string;
        token_type: string;
      } = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: user.refreshToken,
          grant_type: 'refresh_token',
          client_id: GITHUB_APP_CLIENT_ID,
          client_secret: GITHUB_APP_CLIENT_SECRET,
        }),
      }).then((res) => res.json());

      const now = new Date();
      const time = now.getTime();
      const refreshTokenExpiresAt = new Date(
        time + Number(res?.refresh_token_expires_in ?? 0)
      );

      return await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          githubAccessToken: res.access_token,
          refreshToken: res.refresh_token,
          refreshTokenExpiresAt,
        },
      });
    }

    return user;
  }
}
