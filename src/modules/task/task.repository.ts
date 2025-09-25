import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  createTask(task: CreateTaskDto): Promise<TaskDocument> {
    const createdTask = new this.taskModel(task);
    return createdTask.save();
  }

  findAllTasks(farmId: string): Promise<TaskDocument[]> {
    return this.taskModel.find({ farmId }).exec();
  }

  findTaskById(farmId: string, id: string): Promise<TaskDocument> {
    return this.taskModel.findOne({ farmId, _id: id }).exec();
  }

  updateTask(
    farmId: string,
    id: string,
    task: UpdateTaskDto,
  ): Promise<TaskDocument> {
    return this.taskModel
      .findOneAndUpdate({ farmId, _id: id }, { ...task }, { new: true })
      .exec();
  }

  deleteTask(farmId: string, id: string): Promise<TaskDocument> {
    return this.taskModel.findOneAndDelete({ farmId, _id: id }).exec();
  }
}
