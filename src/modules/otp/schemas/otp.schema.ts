import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OtpPurpose } from '../enums/otp-purpose.enum';
import { Types } from 'mongoose';
import { OtpStatus } from '../enums/otp-status.enum';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<Otp> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Otp {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ enum: OtpPurpose, type: String, required: true })
  purpose: OtpPurpose;

  @Prop({
    enum: OtpStatus,
    type: String,
    required: true,
    default: OtpStatus.ACTIVE,
  })
  status: OtpStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp);

OtpSchema.index({ userId: 1, purpose: 1 }, { unique: true });

OtpSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
});

OtpSchema.set('toJSON', { virtuals: true });
