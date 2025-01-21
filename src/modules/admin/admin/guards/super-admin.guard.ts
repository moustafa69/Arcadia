import { AuthGuard } from '@nestjs/passport';

export class SuperAdmin extends AuthGuard('super-admin') {
  constructor() {
    super();
  }
}
