import { App, Database, DbTypes, Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { PaginationArgs } from '../../../../data/args/pagination';
import { DatabasePaginationInfo } from '../models/database.model';

@Injectable()
export class DatabaseRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.DatabaseCreateInput): Promise<Database> {
    return this.prisma.database.create({
      data,
    });
  }

  update(id: string, data: Prisma.DatabaseUpdateInput): Promise<Database> {
    return this.prisma.database.update({
      where: { id },
      data,
    });
  }

  get(id: string): Promise<Database> {
    return this.prisma.database.findUnique({
      where: { id },
    });
  }

  getByName(name: string, type: DbTypes): Promise<Database> {
    return this.prisma.database.findFirst({
      where: { name, type },
    });
  }

  getAll(limit?: number): Promise<Database[]> {
    return this.prisma.database.findMany({
      take: limit,
    });
  }

  async getAllPaginated({
    limit,
    page,
  }: PaginationArgs): Promise<DatabasePaginationInfo> {
    const items = await this.prisma.database.findMany({
      take: limit,
      skip: limit * page,
    });

    const total = await this.prisma.database.count();

    const totalPages = Math.ceil(total / limit);

    return {
      items: items as any,
      page,
      totalItems: total,
      totalPages,
      nextPage: page < totalPages ? page + 1 : undefined,
      prevPage: page > 0 ? page - 1 : undefined,
    };
  }

  delete(id: string): Promise<Database> {
    return this.prisma.database.delete({
      where: { id },
    });
  }

  async exists(name: string): Promise<boolean> {
    return (
      (await this.prisma.database.count({
        where: { name },
      })) > 0
    );
  }

  async databaseWithApps(
    databaseId: string,
    appId: string
  ): Promise<Database & { apps: App[] }> {
    return this.prisma.database.findUnique({
      where: {
        id: databaseId,
      },
      include: {
        apps: {
          where: {
            id: appId,
          },
        },
      },
    });
  }

  async linkedApp(databaseId: string, appId: string): Promise<App[]> {
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

  async linkedApps(databaseId: string): Promise<App[]> {
    return this.prisma.database
      .findUnique({
        where: {
          id: databaseId,
        },
      })
      .apps();
  }
}
