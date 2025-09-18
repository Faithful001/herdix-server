import { Module } from '@nestjs/common';
import { LivestockTypeService } from './livestock-type.service';
import { LivestockTypeController } from './livestock-type.controller';
import { LivestockTypeRepository } from './livestock-type.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LivestockType,
  LivestockTypeSchema,
} from './schemas/livestock-type.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LivestockType.name, schema: LivestockTypeSchema },
    ]),
    UserModule,
  ],
  controllers: [LivestockTypeController],
  providers: [LivestockTypeService, LivestockTypeRepository],
  exports: [LivestockTypeService, LivestockTypeRepository],
})
export class LivestockTypeModule {}
