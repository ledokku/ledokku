import { App, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';
import { injectable } from 'tsyringe';
import { Database } from '../../../databases/data/models/database.model';

@Injectable()
@injectable()
export class AppRepository {
  constructor(private prisma: PrismaClient) {}

  async create(name: string): Promise<App> {
    return this.prisma.app.create({
      data: {
        name: name,
        type: 'DOKKU',
      },
    });
  }

  async getAll(): Promise<App[]> {
    return this.prisma.app.findMany();
  }

  async get(id: string): Promise<App> {
    return this.prisma.app.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<App> {
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

  async databases(id: string): Promise<Database[]> {
    return this.prisma.app
      .findUnique({
        where: { id },
      })
      .databases();
  }
}
