import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CropTypeDocument = HydratedDocument<CropType>;

@Schema({ timestamps: true })
export class CropType {
  @Prop({
    required: true,
    unique: true,
    message: 'Crop type already exists',
  })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const CropTypeSchema = SchemaFactory.createForClass(CropType);
