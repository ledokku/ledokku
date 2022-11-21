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
