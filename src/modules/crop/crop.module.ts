import { Module } from '@nestjs/common';
import { CropService } from './crop.service';
import { CropController } from './crop.controller';
import { CropRepository } from './crop.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Crop, CropSchema } from './schemas/crop.schema';
import {
  CropType,
  CropTypeSchema,
} from '../crop-type/schemas/crop-type.schema';
import { CropTypeModule } from '../crop-type/crop-type.module';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Crop.name, schema: CropSchema }]),
    MongooseModule.forFeature([
      { name: CropType.name, schema: CropTypeSchema },
    ]),
    SharedJwtModule,
    CropTypeModule,
    CacheModule,
  ],
  controllers: [CropController],
  providers: [CropService, CropRepository],
})
export class CropModule {}
