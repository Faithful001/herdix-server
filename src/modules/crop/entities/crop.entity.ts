import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HealthStatus } from '../enums/health-status.enum';

export type CropDocument = Crop & Document;

@Schema({ timestamps: true })
export class Crop {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true, enum: HealthStatus, default: HealthStatus.HEALTHY })
  healthStatus: HealthStatus;

  @Prop()
  imageUrl?: string;
}

export const CropSchema = SchemaFactory.createForClass(Crop);
