import nodemailer from 'nodemailer';

const sendEmail = async ({ from, to, subject, text, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
            port: process.env.EMAIL_PORT, // e.g., 587
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from,
            to,
            subject,
            text,
            html
        });

        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error('Email sending error:', err);
        throw err;
    }
};

export default sendEmail;
