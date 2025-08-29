import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    BullModule.registerQueue({
      name: 'otp-queue',
    }),
    EmailModule,
    UserModule,
  ],
  controllers: [OtpController],
  providers: [OtpService, OtpProcessor, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
