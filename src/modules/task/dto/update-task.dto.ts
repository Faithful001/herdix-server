import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsISO8601,
  IsMongoId,
  IsString,
} from 'class-validator';
import { TaskPriority } from '../enums/task-priority.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    example: 'Water the crops',
    description: 'Title of task to carry out',
  })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    example: 'Pour water on the crops',
    description: 'Description of task to carry out',
  })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ example: '1234567890abc', description: 'ID of the farm' })
  @IsMongoId({ message: 'Farm ID must be a valid id' })
  farmId: string;

  @ApiProperty({
    example: '1234567890abc',
    description: 'ID of the worker this task was given to',
  })
  @IsMongoId({ message: 'Assigned To must be a valid id' })
  assignedTo: string[];

  @ApiProperty({ example: 'High', description: 'Priority level of the tasks' })
  @IsEnum(TaskPriority, { message: 'Priority must be a valid enum value' })
  priority: TaskPriority;

  @ApiProperty({
    example: '25-12-2025',
    description: 'Date the worker is expected to commence the task',
  })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    example: '25-12-2025',
    description: 'Date the worker is expected to finish the task',
  })
  @IsISO8601()
  dueDate: string;

  @ApiProperty({
    example: '25-12-2025',
    description: 'Date the worker finished the task',
  })
  @IsISO8601()
  completedAt: string;
}
