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
import { CropTypeService } from './crop-type.service';
import { CreateCropTypeDto } from './dto/create-crop-type.dto';
import { UpdateCropTypeDto } from './dto/update-crop-type.dto';
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

@ApiTags('Crop Type')
@ApiBearerAuth('JWT')
@Controller('crop-types')
export class CropTypeController {
  constructor(private readonly cropTypeService: CropTypeService) {}

  @Post()
  @HttpCode(201)
  @ApiResponse({ status: 201, description: 'Crop type created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create a crop type' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(
    @Req() request: Request,
    @Body() createCropTypeDto: CreateCropTypeDto,
  ) {
    return this.cropTypeService.create(request, createCropTypeDto);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop types found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all crop types' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll(@Req() request: Request) {
    return this.cropTypeService.findAll(request);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a crop type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.cropTypeService.findOne(request, id);
  }

  @Get('name/:name')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a crop type by name' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOneByName(@Req() request: Request, @Param('name') name: string) {
    return this.cropTypeService.findOneByName(request, name);
  }

  @Patch('update/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update a crop type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateCropTypeDto: UpdateCropTypeDto,
  ) {
    return this.cropTypeService.update(request, id, updateCropTypeDto);
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete a crop type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@Req() request: Request, @Param('id') id: string) {
    return this.cropTypeService.delete(request, id);
  }
}
