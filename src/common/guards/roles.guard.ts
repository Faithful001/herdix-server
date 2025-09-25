import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Token } from '../enums/token.enum';
import { UserService } from '../../modules/user/user.service';
import { UserResponseDto } from '../../modules/user/dto/user-response.dto';
import { UserRole } from '../enums/user-role.enum';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  purpose: Token;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: UserResponseDto }>();

    const token = this.extractTokenFromHeader(req);

    try {
      const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;

      // Verify token purpose
      if (payload.purpose !== Token.AUTHORIZATION) {
        throw new UnauthorizedException('Invalid token purpose');
      }

      // Get user
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Handle ALL role
      if (requiredRoles.includes(UserRole.ALL)) {
        const allowedRoles = [UserRole.ADMIN, UserRole.MANAGER];
        if (allowedRoles.includes(user.role as UserRole)) {
          req.user = user;
          return true;
        }
        throw new ForbiddenException('Insufficient role permissions');
      }

      // Check specific role
      if (requiredRoles.includes(user.role as UserRole)) {
        req.user = user;
        return true;
      }

      throw new ForbiddenException('Insufficient role permissions');
    } catch (error) {
      this.logger.error(`Authentication failed: ${error.message}`, error.stack);
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

    return authorization.split(' ')[1];
  }

  // private extractTokenFromHeader(req: Request): string {
  //   const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  //   if (!token) {
  //     throw new UnauthorizedException('Bearer token required');
  //   }
  //   return token;
  // }
}
