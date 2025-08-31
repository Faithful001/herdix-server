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
  create(@Body() createLivestockTypeDto: CreateLivestockTypeDto) {
    return this.livestockTypeService.create(createLivestockTypeDto);
  }

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock types found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find all livestock types' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findAll() {
    return this.livestockTypeService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a livestock type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOne(@Param('id') id: string) {
    return this.livestockTypeService.findOne(id);
  }

  @Get('name/:name')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Find a livestock type by name' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  findOneByName(@Param('name') name: string) {
    return this.livestockTypeService.findOneByName(name);
  }

  @Patch('update/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update a livestock type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id') id: string,
    @Body() updateLivestockTypeDto: UpdateLivestockTypeDto,
  ) {
    return this.livestockTypeService.update(id, updateLivestockTypeDto);
  }

  @Delete('delete/:id')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Livestock type deleted' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete a livestock type by ID' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  delete(@Param('id') id: string) {
    return this.livestockTypeService.delete(id);
  }
}
