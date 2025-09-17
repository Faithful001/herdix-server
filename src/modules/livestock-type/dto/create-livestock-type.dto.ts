import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CreateLivestockTypeDto {
  @ApiProperty({ description: 'The farm id', example: '1234567890abc' })
  @IsMongoId()
  @IsNotEmpty({ message: 'Farm id is required' })
  farmId: string;

  @ApiProperty({ example: 'Cattle', description: 'Name of the livestock type' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: 'This is a cattle',
    description: 'Description of the livestock type',
  })
  @IsString()
  @IsOptional()
  description: string;
}
