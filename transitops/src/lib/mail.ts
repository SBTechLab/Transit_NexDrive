import nodemailer from 'nodemailer';

const notificationsEnabled = process.env.NOTIFICATIONS_ENABLED === 'true';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  if (!notificationsEnabled) {
    console.log(`[Email Suppressed] To: ${to} | Subject: ${subject}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `TransitOps <${process.env.SMTP_FROM}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
    });
    console.log(`[Email Sent] MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`[Email Failed] To: ${to} | Error:`, error);
  }
};
