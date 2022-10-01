import { PrismaClient } from '@prisma/client';
import { $log, InjectorService } from '@tsed/common';
import express from 'express';
import { readFile } from 'fs/promises';
import jsonwebtoken from 'jsonwebtoken';
import { sshKeyPath } from '../config';
import { sshConnect } from '../lib/ssh';
import { JWT_SECRET } from './../constants';
import { DokkuContext } from '../data/models/dokku_context';

export class ContextFactory {
  private static async generateBaseContext(): Promise<Partial<DokkuContext>> {
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
      prisma: injector.get(PrismaClient),
      sshContext: {
        publicKey,
        connection: sshConnection,
      },
    };
  }

  static async createFromHTTP(req: express.Request): Promise<DokkuContext> {
    const token =
      req.headers['authorization'] &&
      (req.headers['authorization'] as string).replace('Bearer ', '');

    let userId: string | undefined;
    try {
      const decoded = jsonwebtoken.verify(token, JWT_SECRET) as {
        userId: string;
      };
      userId = decoded.userId;
    } catch (e) {}

    return <DokkuContext>{
      ...(await ContextFactory.generateBaseContext()),
      auth: userId
        ? {
            token,
            userId,
          }
        : undefined,
    };
  }

  static async createFromWS(connectionParams: any): Promise<DokkuContext> {
    let userId: string | undefined;
    try {
      const decoded = jsonwebtoken.verify(
        connectionParams.token,
        JWT_SECRET
      ) as {
        userId: string;
      };
      userId = decoded.userId;
    } catch (e) {}

    return <DokkuContext>{
      ...(await ContextFactory.generateBaseContext()),
      auth: userId
        ? {
            token: connectionParams.token,
            userId,
          }
        : undefined,
    };
  }
}
