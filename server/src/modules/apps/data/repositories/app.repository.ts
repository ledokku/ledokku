import { App, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { injectable } from 'tsyringe';
import { Database } from '../../../databases/data/models/database.model';

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

  async databases(id: string): Promise<Database[]> {
    return this.prisma.app
      .findUnique({
        where: { id },
      })
      .databases();
  }
}
