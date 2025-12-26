import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.MAIL_USER,
    pass: ENV.MAIL_PASS,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  await transporter.sendMail({
    from: options.from || ENV.MAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

export const sendVerifyEmail = async (
  email: string,
  username: string,
  token: string
) => {
  const verifyLink = `${ENV.BACKEND_URL}/api/v1/auth/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Verify your email',
    html: `
        <h2>Hello ${username}</h2>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyLink}">Verify Email</a>
        <p>This link will expire in ${ENV.EMAIL_VERIFY_EXPIRE_MINUTES} minutes.</p>
        `,
  });
};
