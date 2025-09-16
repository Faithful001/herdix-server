import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateFarmerDto {
  @ApiProperty({ description: "The farmer's first name", example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "The farmer's last name", example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "The farmer's email",
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The farmer's phoneNumber",
    example: '08012345678',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: "The farmer's address",
    example: '123 Main St',
  })
  @IsString()
  address: string;
}
