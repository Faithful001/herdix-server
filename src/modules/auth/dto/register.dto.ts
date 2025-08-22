import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches } from 'class-validator';
import { UserRole } from 'src/modules/users/enums/user-role.enum';

export class RegisterDto {
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

  @ApiProperty({ description: "The user's password", example: 'password123' })
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Invalid password provided' },
  )
  password: string;

  @ApiProperty({
    description: "The user's role",
    example: UserRole.FARMER,
    enum: UserRole,
    enumName: 'UserRole',
  })
  @IsEnum(UserRole, { message: 'Invalid role provided' })
  role: UserRole;
}
