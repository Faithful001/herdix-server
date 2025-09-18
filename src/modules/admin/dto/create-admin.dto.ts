import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ description: "The admin's first name", example: 'John' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiProperty({ description: "The admin's last name", example: 'Doe' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @ApiProperty({
    description: "The admin's email",
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: "The admin's password",
    example: 'password123',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    description: "The admin's phone number",
    example: '08012345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiProperty({
    description: "The admin's address",
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
