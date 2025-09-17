import {
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { HealthStatus } from '../enums/health-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLivestockDto {
  @ApiProperty({ description: 'The farm id', example: '1234567890abc' })
  @IsMongoId()
  @IsNotEmpty({ message: 'Farm id is required' })
  farmId: string;

  @ApiProperty({
    description: 'Livestock type',
    example: 'Cattle',
    required: true,
  })
  @IsString({ message: 'Livestock type mus be a string' })
  @IsNotEmpty({ message: 'Livestock type is required' })
  type: string;

  @ApiProperty({
    description: 'Livestock age',
    example: 2,
    required: true,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty({ message: 'Livestock age is required' })
  age: number;

  @ApiProperty({
    description: 'Livestock health status',
    example: 'Healthy',
    required: true,
  })
  @IsString()
  @IsEnum(HealthStatus, { message: 'Invalid health status provided' })
  healthStatus: HealthStatus;

  @ApiProperty({
    description: 'Livestock image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class BulkCreateLivestockDto {
  @ApiProperty({
    description: 'Livestock type',
    example: 'Cattle',
    required: true,
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Livestock age',
    example: 2,
    required: true,
  })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({
    description: 'Livestock health status',
    example: 'Healthy',
    required: true,
  })
  @IsEnum(HealthStatus)
  healthStatus: HealthStatus;

  @ApiProperty({
    description: 'Livestock quantity',
    example: 10,
    required: true,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Livestock image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
