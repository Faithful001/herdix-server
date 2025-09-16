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
import { LivestockService } from './livestock.service';
import {
  BulkCreateLivestockDto,
  CreateLivestockDto,
} from './dto/create-livestock.dto';
import { UpdateLivestockDto } from './dto/update-livestock.dto';
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

@ApiTags('Livestock')
@ApiBearerAuth('JWT')
@Controller('livestocks')
export class LivestockController {
  constructor(private readonly livestockService: LivestockService) {}

  @Post('create')
  @ApiResponse({ status: 201, description: 'Livestock created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create a livestock' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(201)
  create(
    @Req() request: Request,
    @Body() createLivestockDto: CreateLivestockDto,
  ) {
    return this.livestockService.create(request, createLivestockDto);
  }

  @Post('create-bulk')
  @ApiResponse({ status: 201, description: 'Livestocks created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create livestock' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(201)
  createBulk(
    @Req() request: Request,
    @Body() bulkCreateLivestockDto: BulkCreateLivestockDto,
  ) {
    return this.livestockService.createBulk(request, bulkCreateLivestockDto);
  }

  @Post('create-many')
  @ApiResponse({ status: 201, description: 'Livestocks created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create livestock' })
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  createMany(
    @Req() request: Request,
    @Body() createLivestockDto: CreateLivestockDto[],
  ) {
    return this.livestockService.createMany(request, createLivestockDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Livestocks found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all livestock' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  findAll(@Req() request: Request) {
    return this.livestockService.findAll(request);
  }

  @Get('type/:type')
  @ApiResponse({ status: 200, description: 'Livestocks found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all livestock of a type' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  findManyByType(@Req() request: Request, @Param('type') type: string) {
    return this.livestockService.findManyByType(request, type);
  }

  @ApiResponse({ status: 200, description: 'Livestock found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a livestock by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.livestockService.findOne(request, id);
  }

  @ApiResponse({ status: 200, description: 'Livestock updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update a livestock by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateLivestockDto: UpdateLivestockDto,
  ) {
    return this.livestockService.update(request, id, updateLivestockDto);
  }

  @ApiResponse({ status: 200, description: 'Livestock deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete a livestock by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Delete(':id')
  delete(@Req() request: Request, @Param('id') id: string) {
    return this.livestockService.delete(request, id);
  }
}
