import { App, Database, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { injectable } from 'tsyringe';

@Injectable()
@injectable()
export class DatabaseRepository {
  constructor(private prisma: PrismaClient) {}

  get(id: string): Promise<Database> {
    return this.prisma.database.findUnique({
      where: { id },
    });
  }

  getAll(): Promise<Database[]> {
    return this.prisma.database.findMany();
  }

  async linkedApps(databaseId: string, appId: string): Promise<App[]> {
    return this.prisma.database
      .findUnique({
        where: {
          id: databaseId,
        },
        select: {
          apps: {
            where: {
              id: appId,
            },
          },
        },
      })
      .apps();
  }
}
