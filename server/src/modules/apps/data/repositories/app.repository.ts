import { PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

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

  getAll() {
    return this.prisma.app.findMany();
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
