import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Request } from 'express';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth('JWT')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @ApiResponse({ status: 201, description: 'Inventory created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Create inventory' })
  async createInventory(
    @Req() request: Request,
    @Body() createInventoryDto: CreateInventoryDto,
  ) {
    const { farmId } = request.user;
    return this.inventoryService.createInventory(farmId, createInventoryDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @ApiResponse({ status: 201, description: 'Inventories fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Fetch all inventories' })
  async findAllInventory(@Req() request: Request) {
    const { farmId } = request.user;
    return this.inventoryService.findAllInventory(farmId);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @ApiResponse({ status: 201, description: 'Inventory fetched successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Fetch one inventory' })
  async findOneInventory(@Req() request: Request, @Param('id') id: string) {
    const { farmId } = request.user;
    return this.inventoryService.findOneInventory(farmId, id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @ApiResponse({ status: 201, description: 'Inventory updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Update inventory' })
  async updateInventory(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    const { farmId } = request.user;
    return this.inventoryService.updateInventory(
      farmId,
      id,
      updateInventoryDto,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @ApiResponse({ status: 201, description: 'Inventory deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({ summary: 'Delete inventory' })
  async deleteInventory(@Req() request: Request, @Param('id') id: string) {
    const { farmId } = request.user;
    return this.inventoryService.deleteInventory(farmId, id);
  }
}
