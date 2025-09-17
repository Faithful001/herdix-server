import {
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiBearerAuth('JWT')
@Controller('ai')
@ApiTags('AI')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('detect-crop-health')
  @ApiOperation({ summary: 'Detect crop health' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Crop health detected successfully',
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @UseInterceptors(FileInterceptor('file'))
  async detectCropHealth(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }
    const image = file.buffer.toString('base64');
    return this.aiService.detectCropHealth(image);
  }

  @Post('detect-livestock-health')
  @ApiOperation({ summary: 'Detect livestock health' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Livestock health detected successfully',
  })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ALL)
  @UseInterceptors(FileInterceptor('file'))
  async detectLivestockHealth(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }
    const image = file.buffer.toString('base64');
    return this.aiService.detectLivestockHealth(image);
  }
}
