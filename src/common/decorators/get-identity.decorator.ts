import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// When data is passed to the decorator (e.g., @GetCurrentUser('someProperty')), the decorator attempts to extract the specified property (someProperty) from the user object in the request.
// If data is not provided, the entire user object is returned.

export const GetIdentity = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);
