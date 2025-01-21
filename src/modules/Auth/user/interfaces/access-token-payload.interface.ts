import { Status } from '@prisma/client';

export interface UserAccessTokenPayload {
  id: string;
  name: string;
  email: string;
  status: Status;
  sessionId: string;
  iat: number;
  exp: number;
}
