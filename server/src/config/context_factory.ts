import { User } from '@prisma/client';
import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { sshKeyPath } from '../config';
import { DokkuContext } from '../data/models/dokku_context';
import {
  GITHUB_APP_CLIENT_ID,
  JWT_SECRET,
  GITHUB_APP_CLIENT_SECRET,
} from './../constants';
import fetch from 'node-fetch';
import prisma from '../lib/prisma';
import { readFileSync } from 'fs';

const publicKey = readFileSync(`${sshKeyPath}.pub`, {
  encoding: 'utf8',
});

export class ContextFactory {
  static async generateBaseContext(): Promise<Partial<DokkuContext>> {
    return {
      prisma: prisma,
      sshContext: {
        publicKey,
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
        refresh_token_expires_in: number;
        scope: string;
        token_type: string;
      } = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          refresh_token: user.refreshToken,
          grant_type: 'refresh_token',
          client_id: GITHUB_APP_CLIENT_ID,
          client_secret: GITHUB_APP_CLIENT_SECRET,
        }),
      }).then(async (res) => res.json());

      const now = new Date();
      const time = now.getTime();
      const refreshTokenExpiresAt = new Date(
        time + (res?.refresh_token_expires_in ?? 0)
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
