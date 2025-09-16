import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Farm } from 'src/modules/farm/schemas/farm.schema';

export type CropTypeDocument = HydratedDocument<CropType>;

@Schema({ timestamps: true })
export class CropType {
  @Prop({ required: true, type: Types.ObjectId, ref: Farm.name })
  farmId: Types.ObjectId;

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
