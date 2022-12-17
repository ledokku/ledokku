import {
  Activity,
  App,
  AppBuild,
  AppTypes,
  Database,
  DbTypes,
  ModelReferences,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { Injectable } from '@tsed/di';
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
  ): Promise<Activity | Database | AppBuild | undefined> {
    return this.referenceToTable(referenceType)?.findUnique({
      where: {
        id: referenceId,
      },
    });
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
  ): Prisma.ActivityDelegate<GlobalReject> | undefined {
    switch (referenceType) {
      case ModelReferences.App:
        this.prisma.app;
        break;
      case ModelReferences.AppBuild:
        this.prisma.appBuild;
        break;
      case ModelReferences.Database:
        this.prisma.database;
        break;
    }

    return undefined;
  }
}
