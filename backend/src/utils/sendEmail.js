import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Missing Email Credentials in environment variables");
        throw new Error("Missing Email Credentials");
    }

    // Explicit host and port 465 (SSL) is often more stable than 587 on Render
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 15000, // 15 seconds
        greetingTimeout: 15000,
        socketTimeout: 15000,
    });

    try {
        await transporter.sendMail({
            from: `"${process.env.APP_NAME || 'Real Estate Platform'}" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message.replace(/<[^>]*>?/gm, ''), // Plain text version
            html: options.message,
        });
        console.log("Email sent successfully to:", options.email);
    } catch (error) {
        console.error("Nodemailer Send Error:", error.message);
        throw error; // Rethrow to show in the main logs
    }
};

export default sendEmail;