import { Status } from '@prisma/client';
import { BaseIdentity } from './base-identity.interface';

export interface UserIdentity extends BaseIdentity {
  id: string;
  name: string;
  email: string;
  sessionId: string;
  status: Status;
  type?: string;
  iat: number;
  exp: number;
}
