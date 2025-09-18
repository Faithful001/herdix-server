import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from '../user/enums/user-role.enum';
import { Request } from 'express';

@ApiTags('Manager')
@ApiBearerAuth('JWT')
@Controller('managers')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a manager' })
  @ApiResponse({
    status: 200,
    description: 'The manager has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Req() request: Request, @Body() createManagerDto: CreateManagerDto) {
    return this.managerService.create(request, createManagerDto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find all managers' })
  @ApiResponse({
    status: 200,
    description: 'List of all managers',
  })
  findAll(@Req() request: Request) {
    return this.managerService.findAll(request);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Find a manager by ID' })
  @ApiResponse({
    status: 200,
    description: 'The found manager',
  })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.managerService.findOne(request, id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a manager' })
  @ApiResponse({
    status: 200,
    description: 'The manager has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateManagerDto: UpdateManagerDto,
  ) {
    return this.managerService.update(request, id, updateManagerDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a manager' })
  @ApiResponse({
    status: 200,
    description: 'The manager has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Manager not found' })
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.managerService.remove(request, id);
  }
}
