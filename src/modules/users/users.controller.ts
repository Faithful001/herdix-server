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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomMessage } from 'src/common/decorators/custom-message.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(200)
  @CustomMessage('User retrieved successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Find all farmers' })
  @ApiResponse({
    status: 200,
    description: 'The farmers have been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(200)
  @CustomMessage('Farmers retrieved successfully')
  @Get('farmers')
  findAllFarmers() {
    return this.usersService.findAllFarmers();
  }

  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Find all managers' })
  @ApiResponse({
    status: 200,
    description: 'The managers have been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(200)
  @CustomMessage('Managers retrieved successfully')
  @Get('managers')
  findAllManagers() {
    return this.usersService.findAllManagers();
  }

  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Find all admins' })
  @ApiResponse({
    status: 200,
    description: 'The admins have been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(200)
  @CustomMessage('Admins retrieved successfully')
  @Get('admins')
  findAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update user email' })
  @ApiResponse({
    status: 200,
    description: 'The user email has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @HttpCode(200)
  @CustomMessage('User email updated successfully')
  @Patch('update-email')
  update(
    @Req() req: Request,
    @Body() email: Pick<UpdateUserDto, 'email'>['email'],
  ) {
    return this.usersService.updateEmail(req, email);
  }

  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(200)
  @CustomMessage('User deleted successfully')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
