import { ModelReferences, Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { toObjectType } from '../../../../utils';
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

  async getModelReference(
    referenceType: ModelReferences,
    referenceId: string
  ): Promise<App | Database | AppBuild | undefined> {
    const filter = { where: { id: referenceId } };
    switch (referenceType) {
      case ModelReferences.App:
        return toObjectType(App, await this.prisma.app.findUnique(filter));
      case ModelReferences.AppBuild:
        return toObjectType(
          AppBuild,
          await this.prisma.appBuild.findUnique(filter)
        );
      case ModelReferences.Database:
        return toObjectType(
          Database,
          await this.prisma.database.findUnique(filter)
        );
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
}
