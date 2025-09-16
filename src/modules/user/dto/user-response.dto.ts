import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({ description: "The user's ID", example: '1234567890abcdef' })
  @IsString()
  _id: string;

  @ApiProperty({ description: 'The farm ID', example: '1234567890abcdef' })
  @IsString()
  farmId: string;

  @ApiProperty({ description: "The user's first name", example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "The user's last name", example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: "The user's email",
    example: 'john.doe@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({ description: "The user's role", example: 'farmer' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: "The user's password changed status",
    example: false,
  })
  @IsBoolean()
  isPasswordChanged: boolean;
}
