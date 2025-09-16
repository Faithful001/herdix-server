import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMongoId, IsString, Matches } from 'class-validator';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({ description: 'Farm id', example: '123445678ab' })
  @IsMongoId()
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
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The user's phoneNumber",
    example: '08012345678',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: "The user's address",
    example: '123 Main St',
  })
  @IsString()
  address: string;

  @ApiProperty({ description: "The user's password", example: 'password123' })
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Invalid password provided' },
  )
  password: string;

  @ApiProperty({ description: "The user's role", example: 'farmer' })
  @IsEnum(UserRole, { message: 'Invalid role provided' })
  role: UserRole;
}
