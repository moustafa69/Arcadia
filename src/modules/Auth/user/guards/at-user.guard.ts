import { AuthGuard } from '@nestjs/passport';

export class AtGuard extends AuthGuard('at-user') {
  constructor() {
    super();
  }
}
