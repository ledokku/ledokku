import { PrismaClient } from '@prisma/client';
import { NodeSSH } from 'node-ssh';
import { AuthContext } from './auth_context';
export interface DokkuContext {
  auth?: AuthContext;
  prisma: PrismaClient;
  sshContext: {
    connection?: NodeSSH;
    publicKey: string;
  };
}
