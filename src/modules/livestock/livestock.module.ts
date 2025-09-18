import { Module } from '@nestjs/common';
import { LivestockService } from './livestock.service';
import { LivestockController } from './livestock.controller';
import { LivestockRepository } from './livestock.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Livestock, LivestockSchema } from './schemas/livestock.schema';
import {
  LivestockType,
  LivestockTypeSchema,
} from '../livestock-type/schemas/livestock-type.schema';
import { LivestockTypeModule } from '../livestock-type/livestock-type.module';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Livestock.name, schema: LivestockSchema },
    ]),
    MongooseModule.forFeature([
      { name: LivestockType.name, schema: LivestockTypeSchema },
    ]),
    UserModule,
    LivestockTypeModule,
  ],
  controllers: [LivestockController],
  providers: [LivestockService, LivestockRepository],
})
export class LivestockModule {}
