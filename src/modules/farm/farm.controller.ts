import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('farms')
@ApiTags('Farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a farm' })
  @ApiResponse({
    status: 200,
    description: 'The farm has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.create(createFarmDto);
  }

  @Get()
  @ApiBearerAuth('JWT')
  @HttpCode(200)
  @ApiOperation({ summary: 'Find a farm by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @ApiResponse({
    status: 200,
    description: 'The farm has been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Req() request: Request) {
    return this.farmService.findOne(request);
  }

  @Patch()
  @ApiBearerAuth('JWT')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a farm' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    status: 200,
    description: 'The farm has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  update(@Req() request: Request, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.update(request, updateFarmDto);
  }

  // @Delete()
  // @HttpCode(200)
  // @ApiOperation({ summary: 'Delete a farm' })
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ALL)
  // @ApiResponse({
  //   status: 200,
  //   description: 'The farm has been successfully deleted.',
  // })
  // @ApiResponse({ status: 400, description: 'Bad Request.' })
  // remove(@Req() request: Request) {
  //   return this.farmService.remove(request);
  // }
}
