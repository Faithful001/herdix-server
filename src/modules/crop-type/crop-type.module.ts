import { Module } from '@nestjs/common';
import { CropTypeService } from './crop-type.service';
import { CropTypeController } from './crop-type.controller';
import { CropTypeRepository } from './crop-type.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CropType, CropTypeSchema } from './schemas/crop-type.schema';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CropType.name, schema: CropTypeSchema },
    ]),
    SharedJwtModule,
  ],
  controllers: [CropTypeController],
  providers: [CropTypeService, CropTypeRepository],
  exports: [CropTypeService, CropTypeRepository],
})
export class CropTypeModule {}
