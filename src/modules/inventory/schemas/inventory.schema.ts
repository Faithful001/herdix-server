import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Number })
  costPrice: number;

  @Prop({ type: Number, default: null, required: false })
  sellingPrice?: number;

  @Prop({ type: String })
  farmId: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
