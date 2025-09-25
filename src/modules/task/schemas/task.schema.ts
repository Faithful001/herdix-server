import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Farm } from 'src/modules/farm/schemas/farm.schema';
import { User } from 'src/modules/user/schemas/user.schema';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Types.ObjectId, ref: Farm.name })
  farmId: Types.ObjectId;

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: User.name }] })
  assignedTo: Types.ObjectId[];

  @Prop({ required: true, type: String })
  priority: TaskPriority;

  @Prop({ required: true, type: String, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  dueDate: Date;

  @Prop({ required: false, type: Date, default: null })
  completedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  createdBy: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
