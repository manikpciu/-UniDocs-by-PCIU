import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendEmail(to, subject, html){
  if(!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured, skip sending to', to);
    return false;
  }
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to, subject, html
  });
  return info;
}
