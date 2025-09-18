import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { Model } from 'mongoose';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { OtpPurpose } from './enums/otp-purpose.enum';
import { OtpStatus } from './enums/otp-status.enum';

export class OtpRepository {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {}

  async createOtp(data: {
    userId: string;
    purpose: OtpPurpose;
    otp: string;
  }): Promise<OtpDocument> {
    // ensure uniqueness by replacing old OTP for same userId + purpose
    return this.otpModel
      .findOneAndUpdate(
        { userId: data.userId, purpose: data.purpose },
        {
          $set: {
            ...data,
            status: OtpStatus.ACTIVE,
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
          new: true,
        },
      )
      .exec();
  }

  async findOtpById(otpId: string): Promise<OtpDocument | null> {
    return this.otpModel.findOne({ _id: otpId }).lean().exec();
  }

  async findOtpByUserId(userId: string): Promise<OtpDocument | null> {
    return this.otpModel.findOne({ userId }).lean().exec();
  }

  async findLatestOtp(userId: string, purpose: string) {
    return this.otpModel
      .findOne({ userId, purpose })
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateOtp(
    otpId: string,
    userId: string,
    updateOtpDto: UpdateOtpDto,
  ): Promise<OtpDocument | null> {
    return this.otpModel
      .findOneAndUpdate(
        { _id: otpId, userId, purpose: updateOtpDto.purpose },
        updateOtpDto,
        { new: true },
      )
      .lean()
      .exec();
  }

  async updateOtpStatus(
    otpId: string,
    userId: string,
    purpose: string,
    status: string,
  ): Promise<OtpDocument | null> {
    return this.otpModel
      .findOneAndUpdate(
        { _id: otpId, userId, purpose },
        { status },
        { new: true },
      )
      .lean()
      .exec();
  }

  async deleteOtpById(otpId: string): Promise<OtpDocument | null> {
    return this.otpModel.findByIdAndDelete(otpId).lean().exec();
  }

  async deleteOtp(
    otpId: string,
    userId: string,
    purpose: string,
  ): Promise<OtpDocument | null> {
    return this.otpModel
      .findOneAndDelete({ _id: otpId, userId, purpose })
      .lean()
      .exec();
  }
}
