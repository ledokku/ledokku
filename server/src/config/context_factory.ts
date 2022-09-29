import { PrismaClient } from '@prisma/client';
import { $log } from '@tsed/common';
import express from 'express';
import { readFile } from 'fs/promises';
import jsonwebtoken from 'jsonwebtoken';
import { container } from 'tsyringe';
import { sshKeyPath } from '../config';
import { sshConnect } from '../lib/ssh';
import { JWT_SECRET } from './../constants';
import { DokkuContext } from './../models/dokku_context';

export class ContextFactory {
  private static async generateBaseContext(): Promise<Partial<DokkuContext>> {
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
      prisma: container.resolve(PrismaClient),
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
      userId, // TODO: Eliminar al migrar
      auth: {
        token,
        userId,
      },
    };
  }
}
