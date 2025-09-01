import { PartialType } from '@nestjs/swagger';
import { CreateCropTypeDto } from './create-crop-type.dto';

export class UpdateCropTypeDto extends PartialType(CreateCropTypeDto) {}
