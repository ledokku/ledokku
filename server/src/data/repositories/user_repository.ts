import { Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async get(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getByEmails(emails: string[]) {
    return this.prisma.user.findMany({
      where: {
        email: {
          in: emails,
        },
      },
    });
  }

  async getAll() {
    return this.prisma.user.findMany();
  }
}
