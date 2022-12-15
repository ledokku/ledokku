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

interface AddActivity {
  name: string;
  description?: string;
  instance?: any;
  modifierId?: string;
}

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

  add({ instance, ...activity }: AddActivity) {
    let refersTo: ModelReferences;
    let referenceId: string;

    if (instance) {
      if ('status' in instance && 'appId' in instance) {
        refersTo = ModelReferences.AppBuild;
        referenceId = (instance as AppBuild).id;
      } else if (
        'name' in instance &&
        'type' in instance &&
        Object.values(AppTypes).includes(instance.type)
      ) {
        refersTo = ModelReferences.App;
        referenceId = (instance as App).id;
      } else if (
        'name' in instance &&
        'type' in instance &&
        Object.values(DbTypes).includes(instance.type)
      ) {
        refersTo = ModelReferences.Database;
        referenceId = (instance as Database).id;
      }
    }

    return this.prisma.activity.create({
      data: {
        ...activity,
        refersToModel: refersTo,
        referenceId: referenceId,
      },
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
