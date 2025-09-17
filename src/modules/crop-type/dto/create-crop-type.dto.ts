import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCropTypeDto {
  @ApiProperty({ description: 'The farm id', example: '1234567890abc' })
  @IsMongoId()
  @IsNotEmpty({ message: 'Farm id is required' })
  farmId: string;

  @ApiProperty({ example: 'Corn', description: 'Name of the crop type' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: 'This is a corn',
    description: 'Description of the crop type',
  })
  @IsString()
  @IsOptional()
  description: string;
}
