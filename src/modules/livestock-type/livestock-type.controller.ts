import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LivestockTypeService } from './livestock-type.service';
import { CreateLivestockTypeDto } from './dto/create-livestock-type.dto';
import { UpdateLivestockTypeDto } from './dto/update-livestock-type.dto';
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

@ApiTags('Livestock Type')
@ApiBearerAuth('JWT')
@Controller('livestock-types')
export class LivestockTypeController {
  constructor(private readonly livestockTypeService: LivestockTypeService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Livestock type created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create a livestock type' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(
    @Req() request: Request,
    @Body() createLivestockTypeDto: CreateLivestockTypeDto,
  ) {
    return this.livestockTypeService.create(request, createLivestockTypeDto);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock types found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all livestock types' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Req() request: Request) {
    return this.livestockTypeService.findAll(request);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a livestock type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.livestockTypeService.findOne(request, id);
  }

  @Get('name/:name')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a livestock type by name' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOneByName(@Req() request: Request, @Param('name') name: string) {
    return this.livestockTypeService.findOneByName(request, name);
  }

  @Patch('update/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update a livestock type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateLivestockTypeDto: UpdateLivestockTypeDto,
  ) {
    return this.livestockTypeService.update(
      request,
      id,
      updateLivestockTypeDto,
    );
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete a livestock type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@Req() request: Request, @Param('id') id: string) {
    return this.livestockTypeService.delete(request, id);
  }
}
