import { User } from '@prisma/client';

export class AuthContext {
  token: string;
  user: User;
}
