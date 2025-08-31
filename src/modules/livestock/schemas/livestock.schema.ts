import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { HealthStatus } from '../enums/health-status.enum';
import { LivestockType } from 'src/modules/livestock-type/schemas/livestock-type.schema';

export type LivestockDocument = HydratedDocument<Livestock>;

@Schema({ timestamps: true })
export class Livestock {
  @Prop({ type: Types.ObjectId, ref: LivestockType.name, required: true })
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

export const LivestockSchema = SchemaFactory.createForClass(Livestock);
