import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../auth/models/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const { user }: { user: User } = ctx.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('There is no logged in user');
    }

    delete user.password;

    if (data) {
      return user[data];
    }

    return user;
  },
);
