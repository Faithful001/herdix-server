import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { FarmerService } from './farmer.service';
import { CreateFarmerDto } from './dto/create-farmer.dto';
import { UpdateFarmerDto } from './dto/update-farmer.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Farmer')
@ApiBearerAuth('JWT')
@Controller('farmers')
export class FarmerController {
  constructor(private readonly farmerService: FarmerService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a farmer' })
  @ApiResponse({
    status: 200,
    description: 'The farmer has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createFarmerDto: CreateFarmerDto) {
    return this.farmerService.create(createFarmerDto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Find all farmers' })
  @ApiResponse({
    status: 200,
    description: 'The farmers have been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findAll() {
    return this.farmerService.findAll();
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Find a farmer by ID' })
  @ApiResponse({
    status: 200,
    description: 'The farmer has been successfully found.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update farmer' })
  @ApiResponse({
    status: 200,
    description: 'The farmer has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmerDto: UpdateFarmerDto) {
    return this.farmerService.update(id, updateFarmerDto);
  }

  @Delete(':id')
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Delete farmer' })
  @ApiResponse({
    status: 200,
    description: 'The farmer has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  remove(@Param('id') id: string) {
    return this.farmerService.delete(id);
  }
}
