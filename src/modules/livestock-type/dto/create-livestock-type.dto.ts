import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLivestockTypeDto {
  @ApiProperty({ example: 'Cattle', description: 'Name of the livestock type' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: 'This is the cattle',
    description: 'Description of the livestock type',
  })
  @IsString()
  @IsOptional()
  description: string;
}
