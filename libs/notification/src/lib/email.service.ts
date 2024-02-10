import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

interface transporterConfig extends nodemailer.TransportOptions {
  host: string;
  port: string; // Use 587 for TLS
  secure?: boolean;
  auth: {
    user: string; // Your SMTP Username
    pass: string; // Your SMTP Password
  };
}

export interface mailConfig {
  to: string[];
  cc: string[];
  subject: string;
  html: string;
}

interface MailtrapTransporter {
  host: string;
}

@Injectable()
export class EmailService {
  async sendmail(
    mailinfo: mailConfig,
    transporter_config: transporterConfig | null = null
  ) {
    const configService = new ConfigService();

    if (!transporter_config) {
      transporter_config = {
        host: configService.getOrThrow('smtp_config.host'),
        port: `${configService.getOrThrow('smtp_config.port')}`,
        secure: false,
        auth: {
          user: configService.getOrThrow('smtp_config.user'),
          pass: configService.getOrThrow('smtp_config.pass'),
        },
      };
    }

    const transporter = nodemailer.createTransport(
      transporter_config as MailtrapTransporter
    );
    const mailOptions = {
      from: configService.getOrThrow('smtp_config.from'),
      to: (mailinfo.to || []).join(','),
      cc: (mailinfo.cc || []).join(','),
      subject: mailinfo.subject,
      html: mailinfo.html,
    };
    console.log(mailOptions);

    let mailResp = null;
    let mailSent = false;
    try {
      mailResp = await transporter.sendMail(mailOptions);
      mailSent = true;
    } catch (err) {
      console.log('default_transporter_config', transporter_config);
      console.log('MAIL sent error', err);
      mailResp = err;
    }
    console.log(mailResp);
    return { mailstatus: mailSent, mailgunres: mailResp };
  }
}
