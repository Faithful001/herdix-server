import { Module } from '@nestjs/common';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Farm, FarmSchema } from './schemas/farm.schema';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';
import { FarmRepository } from './farm.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Farm.name, schema: FarmSchema }]),
    SharedJwtModule,
  ],
  controllers: [FarmController],
  providers: [FarmService, FarmRepository],
})
export class FarmModule {}
