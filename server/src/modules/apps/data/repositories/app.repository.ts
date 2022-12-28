import { PaginationArgs } from './../../../../data/args/pagination';
import { Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { AppPaginationInfo } from '../models/app.model';

@Injectable()
export class AppRepository {
  constructor(private prisma: PrismaClient) {}

  create(name: string) {
    return this.prisma.app.create({
      data: {
        name: name,
        type: 'DOKKU',
      },
    });
  }

  update(appId: string, data: Prisma.AppUpdateInput) {
    return this.prisma.app.update({
      where: {
        id: appId,
      },
      data,
    });
  }

  getAll(limit?: number) {
    return this.prisma.app.findMany({
      take: limit,
    });
  }

  async getAllPaginated({
    limit,
    page,
  }: PaginationArgs): Promise<AppPaginationInfo> {
    const items = await this.prisma.app.findMany({
      take: limit,
      skip: limit * page,
    });

    const total = await this.prisma.app.count();

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

  get(id: string) {
    return this.prisma.app.findUnique({
      where: { id },
    });
  }

  getByName(name: string) {
    return this.prisma.app.findFirst({
      where: { name },
    });
  }

  delete(id: string) {
    return this.prisma.app.delete({
      where: { id },
    });
  }

  async generateAppName(appName: string, index: number = 0) {
    const generatedName = appName + (index > 0 ? `-${index}` : '');
    if (await this.exists(generatedName)) {
      return await this.generateAppName(appName, index + 1);
    }

    return generatedName;
  }

  async exists(name: string): Promise<boolean> {
    return (
      (await this.prisma.app.count({
        where: { name },
      })) > 0
    );
  }

  databases(id: string) {
    return this.prisma.app
      .findUnique({
        where: { id },
      })
      .databases();
  }
}
