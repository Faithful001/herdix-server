import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateFarmerDto {
  @ApiProperty({ description: "The farmer's first name", example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: "The farmer's last name", example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: "The farmer's email",
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: "The farmer's phoneNumber",
    example: '08012345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiProperty({
    description: "The farmer's address",
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
