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
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropService.create(createCropDto);
  }

  @Post('create-bulk')
  @ApiResponse({ status: 201, description: 'Crops created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create crops' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(201)
  createBulk(@Body() bulkCreateCropDto: BulkCreateCropDto) {
    return this.cropService.createBulk(bulkCreateCropDto);
  }

  @Post('create-many')
  @ApiResponse({ status: 201, description: 'Crops created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create crops' })
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  createMany(@Body() createCropDto: CreateCropDto[]) {
    return this.cropService.createMany(createCropDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Crops found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all crops' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  findAll() {
    return this.cropService.findAll();
  }

  @Get('type/:type')
  @ApiResponse({ status: 200, description: 'Crops found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all crops of a type' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  findManyByType(@Param('type') type: string) {
    return this.cropService.findManyByType(type);
  }

  @ApiResponse({ status: 200, description: 'Crop found successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a crop by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropService.findOne(id);
  }

  @ApiResponse({ status: 200, description: 'Crop updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update a crop by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropService.update(id, updateCropDto);
  }

  @ApiResponse({ status: 200, description: 'Crop deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete a crop by id' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @HttpCode(200)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cropService.delete(id);
  }
}
