import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Request } from 'express';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TaskStatus } from './enums/task-status.enum';

@ApiTags('Tasks')
@ApiBearerAuth('JWT')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Task created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create a task' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  create(@Req() request: Request, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(request, createTaskDto);
  }

  @Get()
  @ApiResponse({ status: 201, description: 'Tasks fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Fetch all tasks' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  findAll(@Req() request: Request) {
    return this.taskService.findAll(request);
  }

  @Get(':id')
  @ApiResponse({ status: 201, description: 'Task fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Fetch one task' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.taskService.findOne(request, id);
  }

  @Patch(':id')
  @ApiResponse({ status: 201, description: 'Task update successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update task' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(request, id, updateTaskDto);
  }

  @Patch('update-status/:id')
  @ApiResponse({ status: 201, description: 'Task status updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update tasks status' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  updateStatus(
    @Req() request: Request,
    @Param('id') id: string,
    @Query('status') status: TaskStatus,
  ) {
    return this.taskService.updateStatus(request, id, status);
  }

  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Task deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete task' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.taskService.delete(request, id);
  }
}
