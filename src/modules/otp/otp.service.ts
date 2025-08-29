import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpRepository } from './otp.repository';
import { EmailService } from '../email/email.service';
import { UserRepository } from '../user/user.repository';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/common/enums/token.enum';
import { JwtPayload } from 'src/common/types/jwt.type';
import { OtpPurpose } from './enums/otp-purpose.enum';
import * as bcrypt from 'bcrypt';
import { OtpStatus } from './enums/otp-status.enum';

@Injectable()
export class OtpService {
  private readonly OTP_TTL = 5 * 60 * 1000; // 5 minutes in ms

  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly emailService: EmailService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @InjectQueue('otp-queue') private readonly otpQueue: Queue,
  ) {}

  private generate(): string {
    const length = 6;
    const numbers = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      otp += numbers.charAt(randomIndex);
    }
    return otp;
  }

  /**
   * Verify OTP (controller method)
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otpDoc = await this.otpRepository.findLatestOtp(
      verifyOtpDto.userId,
      verifyOtpDto.purpose,
    );

    if (!otpDoc) {
      throw new NotFoundException('OTP not found or already expired.');
    }

    if (otpDoc.status === OtpStatus.VERIFIED) {
      throw new BadRequestException('OTP has already been used.');
    }

    // check expiration using proper Date
    if (Date.now() - otpDoc.updatedAt.getTime() > this.OTP_TTL) {
      await this.otpRepository.deleteOtpById(otpDoc._id.toString());
      throw new BadRequestException('OTP has expired.');
    }

    //  check otp
    const isValidOtp = await bcrypt.compare(verifyOtpDto.otp, otpDoc.otp);
    if (!isValidOtp) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.otpRepository.updateOtpStatus(
      otpDoc._id.toString(),
      verifyOtpDto.userId,
      verifyOtpDto.purpose,
      OtpStatus.VERIFIED,
    );

    // await this.otpRepository.deleteOtpById(otpDoc._id.toString());

    const token = this.jwtService.sign({
      sub: verifyOtpDto.userId,
      purpose: Token.OTP_VERIFICATION,
    } as Omit<JwtPayload, 'email' | 'role'>);

    return { message: 'Otp verified successfully', data: { token } };
  }

  /**
   * Send OTP (controller method)
   */
  async sendOtp(sendOtpDto: SendOtpDto): Promise<{
    message: string;
    data: { userId: string; purpose: OtpPurpose };
  }> {
    const otp = this.generate();
    sendOtpDto['otp'] = otp;

    const user = await this.userRepository.findUserByEmail(sendOtpDto.email);

    const hashedOtp = await bcrypt.hash(otp, 10);

    const otpDoc = await this.otpRepository.createOtp({
      userId: user._id.toString(),
      purpose: sendOtpDto.purpose,
      otp: hashedOtp,
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // send email
    this.emailService.queueEmail({
      email: user.email,
      name: user.firstName,
      subject: 'Otp',
      message: `Your OTP for ${sendOtpDto.purpose} is ${otp}`,
    });

    //delete otp after 5mins
    this.addDeleteOtpToQueue(otpDoc._id.toString());

    return {
      message: 'Otp sent to your email. OTP expires in 5 minutes',
      data: { userId: otpDoc.userId.toString(), purpose: otpDoc.purpose },
    };
  }

  /**
   * Delete OTP after TTL (via queue)
   */
  private async addDeleteOtpToQueue(otpId: string): Promise<void> {
    try {
      await this.otpQueue.add(
        'delete-otp',
        { otpId },
        {
          delay: 5 * 60 * 1000, // 5 minutes
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    } catch (error) {
      console.error('Failed to queue otp', error);
      throw new InternalServerErrorException('Failed to queue otp');
    }
  }
}
