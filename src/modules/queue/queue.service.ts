import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('default') private readonly defaultQueue: Queue,
    // Add more queues here as needed, e.g.:
    // @InjectQueue('another-queue') private readonly anotherQueue: Queue,
  ) {}

  async addJob(jobName: string, data: any, options?: any) {
    return this.defaultQueue.add(jobName, data, options);
  }

  // Add more methods for other queues if needed
}
