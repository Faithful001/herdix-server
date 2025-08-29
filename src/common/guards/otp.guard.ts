import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../modules/user/user.service';
import { UserResponseDto } from 'src/modules/user/dto/user-response.dto';
import { OtpPurpose } from 'src/modules/otp/enums/otp-purpose.enum';
import { Token } from '../enums/token.enum';
import { OTP_PURPOSE_KEY } from '../decorators/otp-purpose.decorator';
import { OtpRepository } from 'src/modules/otp/otp.repository';
import { OtpStatus } from 'src/modules/otp/enums/otp-status.enum';
import { OtpResponseDto } from 'src/modules/otp/dto/otp-response.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  purpose: Token;
}

@Injectable()
export class OtpGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly otpRepository: OtpRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredOtpPurpose = this.reflector.getAllAndOverride<OtpPurpose>(
      OTP_PURPOSE_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserResponseDto }>();
    const token = this.extractTokenFromHeader(request);

    const payload = (await this.jwtService.verifyAsync(token)) as JwtPayload;
    if (payload.purpose !== Token.OTP_VERIFICATION) {
      throw new UnauthorizedException('Invalid token purpose');
    }

    const otpDoc = await this.otpRepository.findLatestOtp(
      payload.sub,
      requiredOtpPurpose,
    );

    if (!otpDoc) {
      throw new UnauthorizedException('Otp not found');
    }

    if (otpDoc.status !== OtpStatus.VERIFIED) {
      throw new UnauthorizedException('Otp not verified');
    }

    if (!requiredOtpPurpose) {
      throw new UnauthorizedException('Otp purpose not found');
    }

    if (requiredOtpPurpose && requiredOtpPurpose !== otpDoc.purpose) {
      throw new UnauthorizedException('Invalid otp purpose');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user;
    request.otp = {
      ...otpDoc.toObject(),
      _id: otpDoc._id.toString(),
      userId: otpDoc.userId.toString(),
    } as OtpResponseDto;

    return true;
  }

  private extractTokenFromHeader(req: Request): string {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization header is required');
    }

    return authorization.split(' ')[1];
  }
}
