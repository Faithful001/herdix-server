import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { OtpPurpose } from 'src/modules/otp/enums/otp-purpose.enum';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ description: 'OTP', example: '123456' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ description: 'User id', example: '123' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Purpose',
    example: OtpPurpose.RESETPASSWORD,
    enum: OtpPurpose,
    enumName: 'OtpPurpose',
  })
  @IsEnum(OtpPurpose, { message: 'Invalid purpose provided' })
  purpose: OtpPurpose;
}
