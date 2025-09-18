import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { OtpModule } from '../otp/otp.module';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';

@Module({
  imports: [
    UserModule,
    OtpModule,
    SharedJwtModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'defaultSecret',
    //   signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' },
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [
    AuthService,
    // JwtModule
  ],
})
export class AuthModule {}
