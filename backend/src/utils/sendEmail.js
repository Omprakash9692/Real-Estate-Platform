import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    // Explicit SMTP configuration for better reliability on cloud platforms like Render
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for port 465 (SSL)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
    });

    await transporter.sendMail({
        from: `"${process.env.APP_NAME || 'RealEstateApp'}" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.message,
    });
};

export default sendEmail;