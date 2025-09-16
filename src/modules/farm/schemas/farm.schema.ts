import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FarmDocument = HydratedDocument<Farm>;

@Schema({ timestamps: true })
export class Farm {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  country: string;

  @Prop({ required: true, type: String })
  state: string;

  @Prop({ required: true, type: String })
  address: string;
}

export const FarmSchema = SchemaFactory.createForClass(Farm);
