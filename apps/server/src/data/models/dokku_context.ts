import { PrismaClient } from '@prisma/client';
import { AuthContext } from './auth_context';
export interface DokkuContext {
  auth?: AuthContext;
  prisma: PrismaClient;
  sshContext: {
    publicKey: string;
  };
}
