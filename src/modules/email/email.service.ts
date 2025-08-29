import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JobsOptions, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
// import Formdata from "form-data";
// import Mailgun from "mailgun.js";
// import { IMailgunClient } from "mailgun.js/Interfaces";

export interface ISendEmail {
  email: string;
  name?: string;
  subject: string;
  message: string;
}

const EMAIL_QUEUE_NAME = 'email-queue';

@Injectable()
export class EmailService {
  transport: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(EMAIL_QUEUE_NAME) private readonly emailQueue: Queue,
  ) {
    this.transport = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: 465,
      secure: true, // SSL
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
      tls: {
        rejectUnauthorized: false, // <-- accept self-signed
      },
    });
  }

  // This method is now called by the EmailProcessor
  async sendEmail(data: ISendEmail) {
    try {
      const message = await this.transport.sendMail({
        sender: 'Herdix',
        to: data.email,
        from: this.configService.get<string>('SMTP_SENDER_EMAIL'),
        subject: data.subject,
        html: data.message,
      });
      console.log('SMAIL', message);
      return message;
    } catch (error) {
      console.log('ERROR SENDING EMAIL', error);
      throw new InternalServerErrorException(
        'Something went wrong, please try again and contact support if error persist',
      );
    }
  }

  // This method adds a job to the queue
  async queueEmail(data: ISendEmail, options?: JobsOptions) {
    try {
      return await this.emailQueue.add('send-email', data, options);
    } catch (error) {
      console.error('Failed to queue email', error);
      throw new InternalServerErrorException('Failed to queue email');
    }
  }
}
