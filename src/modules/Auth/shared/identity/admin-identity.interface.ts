import { Admin, Role } from '@prisma/client';
import { BaseIdentity } from './base-identity.interface';

export interface AdminIdentity extends BaseIdentity {
  id: string;
  name: string;
  email: string;
  role: Role;
  sessionId: string;
  iat: number;
  exp: number;
}
