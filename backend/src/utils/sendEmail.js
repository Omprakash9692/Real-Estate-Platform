import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing Email Credentials in environment variables");
        throw new Error("Missing Email Credentials");
    }

    // Using 'service: gmail' is the most reliable way for Nodemailer + Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: `"${process.env.APP_NAME || 'Real Estate Platform'}" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message.replace(/<[^>]*>?/gm, ''), // Strip HTML for plain text version
        html: options.message,
    });
};

export default sendEmail;