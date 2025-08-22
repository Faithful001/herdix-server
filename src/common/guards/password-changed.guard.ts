import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';
import { Request } from 'express';

@Injectable()
export class PasswordChangedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: UserResponseDto }>();

    if (req.path.startsWith('/auth/')) {
      return true;
    }
    return req.user?.isPasswordChanged;
  }
}
