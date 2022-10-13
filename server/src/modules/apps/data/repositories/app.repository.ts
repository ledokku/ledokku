import { PaginationArgs } from './../../../../data/args/pagination';
import { PrismaClient } from '@prisma/client';
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
