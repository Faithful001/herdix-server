import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Farm } from 'src/modules/farm/schemas/farm.schema';

export type LivestockTypeDocument = HydratedDocument<LivestockType>;

@Schema({ timestamps: true })
export class LivestockType {
  @Prop({ required: true, type: Types.ObjectId, ref: Farm.name })
  farmId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    message: 'Livestock type already exists',
  })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const LivestockTypeSchema = SchemaFactory.createForClass(LivestockType);
