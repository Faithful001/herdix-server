import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: "user's current password",
    example: 'currentPassword123',
  })
  @IsString({ message: 'Current password is required' })
  currentPassword: string;

  @ApiProperty({
    description: "user's new password",
    example: 'newPassword123',
  })
  @IsString({ message: 'New password is required' })
  newPassword: string;
}
