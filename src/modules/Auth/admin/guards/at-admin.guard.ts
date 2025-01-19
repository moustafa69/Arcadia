import { AuthGuard } from '@nestjs/passport';

export class AtGuard extends AuthGuard('at-admin') {
  constructor() {
    super();
  }
}
