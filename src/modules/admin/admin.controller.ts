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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
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

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find all admins' })
  @ApiResponse({
    status: 200,
    description: 'List of all admins',
  })
  findAll(@Req() request: Request) {
    return this.adminService.findAll(request);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update admin' })
  @ApiResponse({
    status: 200,
    description: 'The manager has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(request, id, updateAdminDto);
  }
}
