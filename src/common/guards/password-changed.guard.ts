import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { Token } from '../enums/token.enum';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  purpose: Token;
}
@Injectable()
export class PasswordChangedGuard implements CanActivate {
  private excludedPaths = ['/health', '/auth', '/otp'];

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserResponseDto }>();

    // Skip guard for excluded paths
    if (
      this.excludedPaths.some((path) =>
        request.path.startsWith(`${'/api/v1' + path}`),
      )
    ) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    try {
      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;

      if (payload.purpose !== Token.AUTHORIZATION) {
        throw new UnauthorizedException('Invalid token purpose');
      }

      const user = await this.userService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user?.isPasswordChanged) {
        throw new ForbiddenException('Password must be changed');
      }
      request.user = user;

      return true;
    } catch (error) {
      throw error instanceof ForbiddenException
        ? error
        : new UnauthorizedException(error.message || 'Authentication failed');
    }
  }

  private extractTokenFromHeader(req: Request): string {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is required');
    }

    return authorization?.split(' ')[1];
  }
}
