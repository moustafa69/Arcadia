import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

export interface IMailContent {
  email: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  async sendMail(message: IMailContent) {
    sgMail.setApiKey(this.configService.get('MAIL_SERVICE_API_KEY'));
    const { email, subject, text, html } = message;
    const msg = {
      to: email,
      from: this.configService.get('APP_MAIL'),
      subject,
      text,
      html,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
