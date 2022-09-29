import { App, AppMetaGithub, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { injectable } from 'tsyringe';

@Injectable()
@injectable()
export class AppRepository {
  constructor(private prisma: PrismaClient) {}

  async getAll(): Promise<App[]> {
    return this.prisma.app.findMany();
  }

  async get(id: string): Promise<App> {
    return this.prisma.app.findUnique({
      where: { id },
    });
  }
}
