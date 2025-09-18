import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async ({ from, to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,  // e.g., smtp.mailtrap.io
      port: process.env.EMAIL_PORT,  // e.g., 2525
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: from || '"EduSolve" <no-reply@edusolver.com>',
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email sending error:', err);
    throw err;
  }
};

export default sendEmail;
