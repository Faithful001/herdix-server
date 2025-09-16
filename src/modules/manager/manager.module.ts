import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { ManagerRepository } from './manager.repository';
import { EmailService } from 'src/modules/email/email.service';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SharedJwtModule,
  ],
  controllers: [ManagerController],
  providers: [ManagerService, ManagerRepository],
  exports: [ManagerService, ManagerRepository],
})
export class ManagerModule {}
