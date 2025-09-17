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

export class CreateCropDto {
  @ApiProperty({ description: 'The farm id', example: '1234567890abc' })
  @IsMongoId()
  @IsNotEmpty({ message: 'Farm id is required' })
  farmId: string;

  @ApiProperty({
    description: 'Crop type',
    example: 'Corn',
    required: true,
  })
  @IsString({ message: 'Crop type mus be a string' })
  @IsNotEmpty({ message: 'Crop type is required' })
  type: string;

  @ApiProperty({
    description: 'Crop age',
    example: 2,
    required: true,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty({ message: 'Crop age is required' })
  age: number;

  @ApiProperty({
    description: 'Crop health status',
    example: 'Healthy',
    required: true,
  })
  @IsString()
  @IsEnum(HealthStatus, { message: 'Invalid health status provided' })
  healthStatus: HealthStatus;

  @ApiProperty({
    description: 'Crop image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class BulkCreateCropDto {
  @ApiProperty({
    description: 'Crop type',
    example: 'Corn',
    required: true,
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Crop age',
    example: 2,
    required: true,
  })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({
    description: 'Crop health status',
    example: 'Healthy',
    required: true,
  })
  @IsEnum(HealthStatus)
  healthStatus: HealthStatus;

  @ApiProperty({
    description: 'Crop quantity',
    example: 10,
    required: true,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Crop image URL',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
