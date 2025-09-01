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
  create(@Body() createCropTypeDto: CreateCropTypeDto) {
    return this.cropTypeService.create(createCropTypeDto);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop types found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all crop types' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll() {
    return this.cropTypeService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a crop type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.cropTypeService.findOne(id);
  }

  @Get('name/:name')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a crop type by name' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOneByName(@Param('name') name: string) {
    return this.cropTypeService.findOneByName(name);
  }

  @Patch('update/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update a crop type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateCropTypeDto: UpdateCropTypeDto,
  ) {
    return this.cropTypeService.update(id, updateCropTypeDto);
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Crop type deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete a crop type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@Param('id') id: string) {
    return this.cropTypeService.delete(id);
  }
}
