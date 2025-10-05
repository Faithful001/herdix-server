import { IsEnum } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusDto {
  @ApiProperty({ example: 'High', description: 'Priority level of the tasks' })
  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  status: TaskStatus;
}
