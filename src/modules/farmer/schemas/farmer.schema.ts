import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Farm } from 'src/modules/farm/schemas/farm.schema';

export type FarmerDocument = Farmer & Document;

@Schema({ timestamps: true })
export class Farmer {
  @Prop({ required: true, type: String, ref: Farm.name })
  farmId: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: null })
  profileImage: string;
}

export const FarmerSchema = SchemaFactory.createForClass(Farmer);
