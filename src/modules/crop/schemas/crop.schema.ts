import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { HealthStatus } from '../enums/health-status.enum';
import { CropType } from 'src/modules/crop-type/schemas/crop-type.schema';
import { Farm } from 'src/modules/farm/schemas/farm.schema';

export type CropDocument = HydratedDocument<Crop>;

@Schema({ timestamps: true })
export class Crop {
  @Prop({ required: true, type: Types.ObjectId, ref: Farm.name })
  farmId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: CropType.name, required: true })
  type: Types.ObjectId;

  @Prop({ required: true })
  age: number;

  @Prop({ enum: HealthStatus, required: true })
  healthStatus: HealthStatus;

  @Prop({
    type: String,
    required: false,
  })
  imageUrl?: string;
}

export const CropSchema = SchemaFactory.createForClass(Crop);
