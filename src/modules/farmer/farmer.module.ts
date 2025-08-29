import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { FarmerService } from './farmer.service';
import { FarmerController } from './farmer.controller';
import { EmailModule } from '../email/email.module';
import { FarmerRepository } from './farmer.repository';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '1d' },
    }),
  ],
  controllers: [FarmerController],
  providers: [FarmerService, FarmerRepository],
  exports: [FarmerService, FarmerRepository],
})
export class FarmerModule {}
