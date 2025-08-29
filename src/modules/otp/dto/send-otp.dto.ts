import { IsEnum, IsString } from 'class-validator';
import { OtpPurpose } from '../enums/otp-purpose.enum';
import { OtpStatus } from '../enums/otp-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ description: 'User email', example: 'johndoe@example.com' })
  @IsString({ message: 'email is required' })
  email: string;

  @ApiProperty({
    description: 'Purpose',
    example: OtpPurpose.RESETPASSWORD,
    enum: OtpPurpose,
    enumName: 'OtpPurpose',
  })
  @IsEnum(OtpPurpose, { message: 'Invalid purpose provided' })
  purpose: OtpPurpose;
}
