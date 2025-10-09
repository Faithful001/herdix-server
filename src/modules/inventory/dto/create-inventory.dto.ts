import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInventoryDto {
  @ApiProperty({
    example: 'Mowing Maching',
    description: 'Name of inventory',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '1000',
    description: 'Cost price of inventory',
  })
  @IsNotEmpty()
  @IsNumber()
  costPrice: number;

  @ApiProperty({
    example: '1500',
    description: 'Selling price of inventory (only provide if for sale)',
  })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;
}
