import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TaskRepository {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(task: CreateTaskDto): Promise<TaskDocument> {
    const createdTask = new this.taskModel(task);
    return (await createdTask.save()).populate(
      'assignedTo',
      'firstName lastName',
    );
  }

  findAllTasks(farmId: string): Promise<TaskDocument[]> {
    return this.taskModel
      .find({ farmId })
      .populate('assignedTo', 'firstName lastName')
      .exec();
  }

  findTaskById(farmId: string, id: string): Promise<TaskDocument> {
    return this.taskModel
      .findOne({ farmId, _id: id })
      .populate('assignedTo', 'firstName lastName')
      .exec();
  }

  updateTask(
    farmId: string,
    id: string,
    task: UpdateTaskDto,
  ): Promise<TaskDocument> {
    return this.taskModel
      .findOneAndUpdate({ farmId, _id: id }, { ...task }, { new: true })
      .populate('assignedTo', 'firstName lastName')
      .exec();
  }

  updateTaskStatus(
    farmId: string,
    id: string,
    task: UpdateTaskStatusDto,
  ): Promise<TaskDocument> {
    return this.taskModel
      .findOneAndUpdate(
        { farmId, _id: id },
        { status: task.status },
        { new: true },
      )
      .populate('assignedTo', 'firstName lastName')
      .exec();
  }

  deleteTask(farmId: string, id: string): Promise<TaskDocument> {
    return this.taskModel
      .findOneAndDelete({ farmId, _id: id })
      .populate('assignedTo', 'firstName lastName')
      .exec();
  }
}
