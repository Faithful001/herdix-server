import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { Module } from '@nestjs/common';

// @Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' },
    }),
    UserModule,
  ],
  exports: [JwtModule, UserModule],
})
export class SharedJwtModule {}
