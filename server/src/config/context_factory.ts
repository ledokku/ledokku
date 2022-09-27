import { PrismaClient } from '@prisma/client';
import { $log } from '@tsed/common';
import { readFile } from 'fs/promises';
import { container } from 'tsyringe';
import { sshKeyPath } from '../config';
import { sshConnect } from '../lib/ssh';
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
      prismaClient: container.resolve(PrismaClient),
      sshContext: {
        publicKey,
        connection: sshConnection
      },
    };
  }

  static async createFromHTTP(req: Express.Request): Promise<DokkuContext> {
    return <DokkuContext>{
      ...(await ContextFactory.generateBaseContext()),
    };
  }
}
