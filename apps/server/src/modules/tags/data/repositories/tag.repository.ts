import { Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

@Injectable()
export class TagRepository {
  constructor(private prisma: PrismaClient) {}

  get(id: string) {
    return this.prisma.tag.findUnique({
      where: {
        id,
      },
    });
  }

  ensureExist(tags: string[]) {
    return this.prisma.tag.createMany({
      data: tags.map((it) => ({
        name: it,
      })),
      skipDuplicates: true,
    });
  }

  getAll(filter?: Prisma.TagWhereInput) {
    return this.prisma.tag.findMany({
      where: filter,
    });
  }

  databases(id: string) {
    return this.get(id).Databases();
  }

  apps(id: string) {
    return this.get(id).Apps();
  }
}
