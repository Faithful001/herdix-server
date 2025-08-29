import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: "user's email",
    example: 'test@example.com',
  })
  @IsString({ message: 'Email is required' })
  email: string;
}
