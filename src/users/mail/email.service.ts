import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: this.config.get<string>('EMAIL_USER'),
      pass: this.config.get<string>('EMAIL_PASSWORD'), // Use an app password or secure credentials
    },
  });

  async sendEmail(email: string, msg: string) {
    await this.transporter.sendMail({
      from: 'hi i am muntzrdeveloper@gmail.com',
      to: email,
      subject: 'welcome',
      text: msg,
    });
  }


  async sendEmailReset(email: string, code: string) {
    await this.transporter.sendMail({
      from: 'hi i am muntzrdeveloper@gmail.com',
      to: email,
      subject: 'reset paasword',
      text: code,
    });
  }
}
