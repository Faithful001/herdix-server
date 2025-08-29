import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { QueueService } from './queue.service';
import { QueueAuthMiddleware } from './queue-auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'default',
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule implements NestModule {
  constructor(
    private readonly queueService: QueueService,
    @InjectQueue('default') private readonly defaultQueue: Queue,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    const bullAdapters = [new BullMQAdapter(this.defaultQueue)];

    createBullBoard({
      queues: bullAdapters,
      serverAdapter,
    });

    consumer
      .apply(QueueAuthMiddleware, serverAdapter.getRouter())
      .forRoutes('/queues');
  }
}
