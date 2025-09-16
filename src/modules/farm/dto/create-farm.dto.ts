import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Farm name', example: 'Herdix Farm' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Farm country', example: 'Nigeria' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Farm state', example: 'Rivers' })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Farm address', example: '123 Test Street' })
  address: string;
}
