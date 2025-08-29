import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class PasswordChangedGuard implements CanActivate {
  private excludedPaths = ['/health', '/auth'];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Skip guard for excluded paths
    if (this.excludedPaths.some((path) => request.path.startsWith(path))) {
      return true;
    }

    const user = request.user;
    if (user && !user.isPasswordChanged) {
      throw new ForbiddenException('Password must be changed');
    }

    return true;
  }
}
