import { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

export const prisma = new PrismaClient();

container.register(PrismaClient, { useValue: prisma });
