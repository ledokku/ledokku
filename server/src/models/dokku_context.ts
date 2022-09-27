import { PrismaClient } from '@prisma/client';
import { NodeSSH } from 'node-ssh';
export interface DokkuContext {
  auth?: any;
  prismaClient: PrismaClient;
  sshContext: {
    connection?: NodeSSH;
    publicKey: string;
  };
}
