import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService, ISendEmail } from '../email.service';

@Processor('email-queue')
export class EmailProcessor extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }

  async process(job: Job<ISendEmail>): Promise<any> {
    console.log(`Processing email job ${job.id} for: ${job.data.email}`);
    try {
      await this.emailService.sendEmail(job.data);
      console.log(`Email job ${job.id} completed.`);
    } catch (error) {
      console.error(`Email job ${job.id} failed.`, error);
      throw error;
    }
  }
}
