import { App, AppBuild, AppBuildStatus, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

@Injectable()
export class AppBuildRepository {
  constructor(private prisma: PrismaClient) {}

  async get(
    id: string
  ): Promise<
    AppBuild & {
      app: App;
    }
  > {
    return this.prisma.appBuild.findUnique({
      where: { id },
      include: {
        app: true,
      },
    });
  }

  async updateStatus(id: string, status: AppBuildStatus) {
    return this.prisma.appBuild.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}
