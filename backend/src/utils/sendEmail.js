import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing Email Credentials in environment variables");
        throw new Error("Missing Email Credentials");
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS (more compatible with Render/Production)
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false // Helps with some hosting provider certificate issues
        },
        connectionTimeout: 15000,
        socketTimeout: 15000
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