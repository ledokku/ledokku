import { PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async get(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getAll() {
    return this.prisma.user.findMany();
  }
}
