import { forwardRef, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { BullModule } from '@nestjs/bullmq';
import { EmailModule } from '../email/email.module';
import { UserModule } from '../user/user.module';
import { OtpRepository } from './otp.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp } from './schemas/otp.schema';
import { OtpSchema } from './schemas/otp.schema';
import { OtpProcessor } from './processors/otp.processor';
import { EmailService } from '../email/email.service';
import { UserRepository } from '../user/user.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BullModule.registerQueue({
      name: 'otp-queue',
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    SharedJwtModule,
    EmailModule,
    // forwardRef(() => UserModule),
  ],
  controllers: [OtpController],
  providers: [
    OtpService,
    OtpProcessor,
    OtpRepository,
    EmailService,
    UserRepository,
    // JwtService,
  ],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
