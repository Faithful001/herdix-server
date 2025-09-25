import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(request: Request, createTaskDto: CreateTaskDto) {
    const { farmId, _id: userId } = request.user;
    const createParamater = {
      ...createTaskDto,
      createdBy: userId,
      farmId,
    };
    const createdTask = await this.taskRepository.createTask(createParamater);
    return {
      message: 'Task created successfully',
      data: createdTask,
    };
  }

  async findAll(request: Request) {
    const { farmId } = request.user;
    const tasks = await this.taskRepository.findAllTasks(farmId);
    return {
      message: 'Tasks fetched successfully',
      data: tasks,
    };
  }

  async findOne(request: Request, id: string) {
    const { farmId } = request.user;
    const task = await this.taskRepository.findTaskById(farmId, id);
    return {
      message: 'Task fetched successfully',
      data: task,
    };
  }

  async updateStatus(request: Request, id: string, status: TaskStatus) {
    const { farmId } = request.user;
    const updatedTask = await this.taskRepository.updateTask(farmId, id, {
      status,
    });
    return {
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }

  async update(request: Request, id: string, updateTaskDto: UpdateTaskDto) {
    const { farmId } = request.user;
    const updatedTask = await this.taskRepository.updateTask(
      farmId,
      id,
      updateTaskDto,
    );
    return {
      message: 'Task updated successfully',
      data: updatedTask,
    };
  }

  async delete(request: Request, id: string) {
    const { farmId } = request.user;
    const deletedTask = await this.taskRepository.deleteTask(farmId, id);
    return {
      message: 'Task deleted successfully',
      data: deletedTask,
    };
  }
}
