import Contact from "../models/contact.model.js";
import sendEmail from "../utils/sendEmail.js";

export const createContact = async (req, res) => {
    try {
        const { name, email, phone, role, message } = req.body;
        const contact = new Contact({ name, email, phone, role, message });
        await contact.save();

        // Notify Admin via Brevo
        const adminEmail = process.env.EMAIL_USER; // Your admin email from .env
        const adminMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
                <h2 style="color: #0d9488;">New Contact Request</h2>
                <p>You have received a new message from the platform.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Role:</strong> ${role}</p>
                    <p style="margin-top: 15px;"><strong>Message:</strong></p>
                    <p style="font-style: italic; color: #475569;">"${message}"</p>
                </div>
                <p style="margin-top: 20px; font-size: 0.875rem; color: #64748b;">Visit the admin panel to reply to this message.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: adminEmail,
                subject: `New Contact Message from ${name}`,
                message: adminMessage
            });
        } catch (emailErr) {
            console.error("Admin Notification Email Failed:", emailErr.message);
            // Don't fail the request if only notification fails
        }

        res.status(201).json({
            success: true,
            message: "Message sent successfully"
        });
    }
    catch (err) {
        console.error("Contact Error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to send message"
        });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            contacts,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch contacts",
        });
    }
};

export const replyToContact = async (req, res) => {
    try {
        const { contactId, replyMessage } = req.body;

        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        // Send Email via Brevo to User
        const userEmailContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background: #0d9488; padding: 20px; color: white; text-align: center;">
                    <h2 style="margin: 0;">Support Reply</h2>
                </div>
                <div style="padding: 30px;">
                    <p>Hi ${contact.name},</p>
                    <p>Thank you for reaching out to us. Regarding your inquiry:</p>
                    <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #0d9488; margin: 20px 0; font-style: italic; color: #475569;">
                        "${contact.message}"
                    </div>
                    <p style="line-height: 1.6;">${replyMessage}</p>
                    <p style="margin-top: 30px;">Best regards,<br/><strong>The Real Estate Team</strong></p>
                </div>
                <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 0.75rem; color: #64748b;">
                    This is an automated response from our support system.
                </div>
            </div>
        `;

        await sendEmail({
            email: contact.email,
            subject: `Re: Your inquiry on Real Estate Platform`,
            message: userEmailContent
        });

        // Update status
        contact.status = "replied";
        await contact.save();

        res.status(200).json({
            success: true,
            message: "Reply sent successfully"
        });
    } catch (err) {
        console.error("Reply Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to send reply"
        });
    }
};
