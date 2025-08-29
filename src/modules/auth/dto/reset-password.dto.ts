import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: "The user's password",
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
