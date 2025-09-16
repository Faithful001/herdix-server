import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateManagerDto {
  @ApiProperty({ description: "The manager's first name", example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "The manager's last name", example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "The manager's email",
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The manager's phone number",
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
