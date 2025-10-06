import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  //   private logger = new Logger(MailService.name);

  constructor(
    private config: ConfigService
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: 587,
      secure: false,
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, code: number, name?: string) {
    const from = this.config.get<string>('EMAIL_FROM');
    const html = `
      <div style="font-family: sans-serif; line-height: 1.4;">
        <p>Hi ${name || 'there'},</p>
        <p>Your verification code is <strong>${code}</strong>.</p>
        <p>This code will expire in 60 minutes.</p>
        <p>If you didn't create an account, ignore this email.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Verify your account',
        html,
      });
    } catch (err) {
      console.log("Error while sending Email: ", err);
      return err; 
    }
  }
}