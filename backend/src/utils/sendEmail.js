import { Resend } from "resend";

const sendEmail = async (options) => {
    // Development Fallback: If RESEND_API_KEY is not set or is a placeholder, log to console
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes('your-resend-api-key')) {
        console.log("-----------------------------------------");
        console.log("EMAILING IS IN DEVELOPMENT MODE (RESEND)");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log("Message Content:");
        console.log(options.message);
        console.log("-----------------------------------------");
        return;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        // Use RESEND_FROM_EMAIL from env, or fallback to onboarding@resend.dev (test only)
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const { data, error } = await resend.emails.send({
            from: `${process.env.APP_NAME || 'RealEstateApp'} <${fromEmail}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        });

        if (error) {
            console.error("--- RESEND ERROR ---");
            console.error(`Attempted from: ${fromEmail}`);
            console.error(`Error details:`, error);
            console.error("-------------------------");
            throw new Error(error.message);
        }

        console.log(`Email sent to ${options.email}: ${data.id}`);
    } catch (error) {
        console.error("--- RESEND EXCEPTION ---");
        console.error(`Attempted from: onboarding@resend.dev`);
        console.error(`Error Message: ${error.message}`);
        console.error("-------------------------");
        throw error;
    }
};

export default sendEmail;
