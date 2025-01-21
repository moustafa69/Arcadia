import { Status, User } from '@prisma/client';

export interface VerifyUserReturn {
  id: string;
  name: string;
  status: Status;
}
