import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OtpRepository } from '../otp.repository';

@Processor('otp-queue')
export class OtpProcessor extends WorkerHost {
  constructor(private readonly otpRepository: OtpRepository) {
    super();
  }

  async process(job: Job<{ otpId: string }>) {
    console.log(`Processing otp job ${job.id} for: ${job.data.otpId}`);
    try {
      const { otpId } = job.data;
      await this.otpRepository.deleteOtpById(otpId);
      console.log(`Otp job ${job.id} completed.`);
    } catch (error) {
      console.log(`Otp job ${job.id} failed.`);
      throw error;
    }
  }
}
