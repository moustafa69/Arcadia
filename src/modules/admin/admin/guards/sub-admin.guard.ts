import { AuthGuard } from '@nestjs/passport';

export class SubAdmin extends AuthGuard('sub-admin') {
  constructor() {
    super();
  }
}
