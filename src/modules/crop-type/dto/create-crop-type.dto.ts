import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCropTypeDto {
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
