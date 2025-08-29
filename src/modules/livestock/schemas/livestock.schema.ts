import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LivestockTypeDocument = HydratedDocument<LivestockType>;

@Schema({ timestamps: true })
export class LivestockType {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export const LivestockTypeSchema = SchemaFactory.createForClass(LivestockType);
