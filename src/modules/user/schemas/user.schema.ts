import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';
import { Farm } from 'src/modules/farm/schemas/farm.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
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

  @Prop({ enum: UserRole, default: UserRole.FARMER })
  role: UserRole;

  @Prop({ default: false })
  isPasswordChanged: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
