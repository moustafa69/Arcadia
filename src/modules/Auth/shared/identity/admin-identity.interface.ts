import { Role } from '@prisma/client';
import { BaseIdentity } from './base-identity.interface';

export interface AdminIdentity extends BaseIdentity {
  role: Role;
}
