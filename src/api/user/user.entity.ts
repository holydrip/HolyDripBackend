import { RefreshToken, Role } from '@prisma/client';
export class UserEntity {
  id: string;
  name: string;
  role: Role;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  tokens?: RefreshToken[];
}
