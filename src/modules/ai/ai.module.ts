import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ConfigModule } from '@nestjs/config';
import { SharedJwtModule } from 'src/common/modules/shared-jwt.module';

@Module({
  imports: [ConfigModule, SharedJwtModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
