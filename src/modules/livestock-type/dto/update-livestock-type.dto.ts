import { PartialType } from '@nestjs/swagger';
import { CreateLivestockTypeDto } from './create-livestock-type.dto';

export class UpdateLivestockTypeDto extends PartialType(CreateLivestockTypeDto) {}
