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
import { CropService } from './crop.service';
import { BulkCreateCropDto, CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Request } from 'express';

@ApiTags('Crop')
@ApiBearerAuth('JWT')
@Controller('crops')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post('create')
  @ApiResponse({ status: 201, description: 'Crops created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create a crop' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(201)
  create(@Req() request: Request, @Body() createCropDto: CreateCropDto) {
    return this.cropService.create(request, createCropDto);
  }

  @Post('create-bulk')
  @ApiResponse({ status: 201, description: 'Crops created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create crops' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(201)
  createBulk(
    @Req() request: Request,
    @Body() bulkCreateCropDto: BulkCreateCropDto,
  ) {
    return this.cropService.createBulk(request, bulkCreateCropDto);
  }

  @Post('create-many')
  @ApiResponse({ status: 201, description: 'Crops created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create crops' })
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  createMany(@Req() request: Request, @Body() createCropDto: CreateCropDto[]) {
    return this.cropService.createMany(request, createCropDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Crops found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all crops' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  findAll(@Req() request: Request) {
    return this.cropService.findAll(request);
  }

  @Get('type/:type')
  @ApiResponse({ status: 200, description: 'Crops found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all crops of a type' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  findManyByType(@Req() request: Request, @Param('type') type: string) {
    return this.cropService.findManyByType(request, type);
  }

  @ApiResponse({ status: 200, description: 'Crop found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a crop by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.cropService.findOne(request, id);
  }

  @ApiResponse({ status: 200, description: 'Crop updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update a crop by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateCropDto: UpdateCropDto,
  ) {
    return this.cropService.update(request, id, updateCropDto);
  }

  @ApiResponse({ status: 200, description: 'Crop deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete a crop by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Delete(':id')
  delete(@Req() request: Request, @Param('id') id: string) {
    return this.cropService.delete(request, id);
  }
}
