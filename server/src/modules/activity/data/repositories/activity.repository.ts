import { ModelReferences, Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { App } from '../../../apps/data/models/app.model';
import { AppBuild } from '../../../app_build/data/models/app_build.model';
import { Database } from '../../../databases/data/models/database.model';
import { ActivityPaginationInfo } from '../models/activity.model';
import { PaginationArgs } from './../../../../data/args/pagination';

@Injectable()
export class ActivityRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllPaginated(
    { page, limit }: PaginationArgs,
    filter?: Prisma.ActivityWhereInput
  ): Promise<ActivityPaginationInfo> {
    const skip = page * limit;

    const items = await this.prisma.activity.findMany({
      where: filter,
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.activity.count({
      where: filter,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      items: items as any,
      page,
      totalItems: total,
      nextPage: page < totalPages ? page + 1 : undefined,
      prevPage: page > 0 ? page - 1 : undefined,
      totalPages,
    };
  }

  getModelReference(
    referenceType: ModelReferences,
    referenceId: string
  ): Promise<App | Database | AppBuild | undefined> {
    const table = this.referenceToTable(referenceType) as any;

    const data = table?.findUnique({
      where: {
        id: referenceId,
      },
    });

    switch (referenceType) {
      case ModelReferences.App:
        return Object.assign(new App(), data);
      case ModelReferences.AppBuild:
        return Object.assign(new AppBuild(), data);
      case ModelReferences.Database:
        return Object.assign(new Database(), data);
    }
  }

  getModifier(activityId: string) {
    return this.prisma.activity
      .findUnique({
        where: { id: activityId },
      })
      .Modifier();
  }

  add(data: Prisma.ActivityCreateInput) {
    return this.prisma.activity.create({
      data,
    });
  }

  referenceToTable<
    T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
    GlobalReject extends
      | Prisma.RejectOnNotFound
      | Prisma.RejectPerOperation
      | false
      | undefined = 'rejectOnNotFound' extends keyof T
      ? T['rejectOnNotFound']
      : false
  >(
    referenceType: ModelReferences
  ):
    | Prisma.AppDelegate<GlobalReject>
    | Prisma.DatabaseDelegate<GlobalReject>
    | Prisma.AppBuildDelegate<GlobalReject>
    | undefined {
    switch (referenceType) {
      case ModelReferences.App:
        return this.prisma.app;
      case ModelReferences.AppBuild:
        return this.prisma.appBuild;
      case ModelReferences.Database:
        return this.prisma.database;
    }
  }
}
