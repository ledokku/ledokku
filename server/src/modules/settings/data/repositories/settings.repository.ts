import { PrismaClient } from '@prisma/client';
import { Injectable } from '@tsed/di';

@Injectable()
export class SettingsRepository {
  constructor(private prisma: PrismaClient) {}

  async get() {
    const res = await this.prisma.settings.findFirst();
    if (!res) {
      return this.prisma.settings.create({ data: {} });
    }
    return res;
  }
}
